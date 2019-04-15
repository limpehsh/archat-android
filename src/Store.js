import 'babel-polyfill'
import {Alert, AsyncStorage} from 'react-native';
import {observable, action, computed} from 'mobx';
import {autobind} from 'core-decorators';
import io from 'socket.io-client';
import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client'
import authentication from 'feathers-authentication-client';

// AWS EC2 instance
const API_URL = 'http://52.62.125.103:8080';

import Rx from 'rxjs/Rx';
Rx.Observable.of(1,2,3)
import { Accelerometer, Gyroscope } from 'react-native-sensors';
const accelerationObservable = new Accelerometer({
  updateInterval: 100, // defaults to 100ms
});
accelerationObservable
  .map(({ x, y, z }) => x + y + z)
  .filter(speed => speed > 20)
  .subscribe(speed => console.log(`You moved your phone with ${speed}`));
setTimeout(() => {
  accelerationObservable.stop();
}, 1000);

@autobind
export default class Store {

  // Observable fields trigger re-renders in UI components that are dependent
  // on these values
  @observable isAuthenticated = false;
  @observable isConnecting = false;
  @observable user = null;
  @observable messages = [];
  @observable meetData = [];
  @observable locationWatchId = null;
  @observable hasMoreMessages = false;
  @observable skip = 0;
  @observable users= [];
  @observable accelerometer = null;
  @observable degree = null;

  // Using WebSocket protocol for real-time updates
  constructor() {
    const options = {transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000};
    const socket = io(API_URL, options);

    // Configure client app
    this.app = feathers()
      .configure(socketio(socket))
      .configure(hooks())
      .configure(authentication({
        storage: AsyncStorage // To store our accessToken
      }));

    this.connect();

    this.app.service('messages').on('created', createdMessage => {
      this.messages.unshift(this.formatMessage(createdMessage));
    });

    this.app.service('messages').on('removed', removedMessage => {
      this.deleteMessage(removedMessage);
    });

    // Set user to updatedUser if the update type is 'user', otherwise it is a
    // location update stored in meetData, which is consumed by MeetView.js
    this.app.service('users').on('updated', updatedUser => {
      if(this.user == null) {
        return;
      }
        if(updatedUser.updateType == 'user') {
          this.user = updatedUser.updateData;
        } else {
            let updatedMeet = this.meetData.map(user => {
              if(user._id == updatedUser.updateData._id) {
                return updatedUser.updateData;
              } else {
                return user;
              }

            });

            this.meetData = updatedMeet;
        }

    });

    this.app.service('meets').on('created', createdMeet => {
      this.app.service('users').update(this.user._id,
          { $set: { activeMeet: createdMeet } })
      .then(result => {
        // Watch for client location change events and call updateLocation when
        // this occurs
        this.locationWatchId = navigator.geolocation.watchPosition(
            (position) => { this.updateLocation( position.coords.latitude, position.coords.longitude); },
            (error) => { console.log('Error fetching user location.', error); },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 }
          );

        this.meetData = createdMeet.participants.map(user => {
          return {
            _id: user,
            email: null,
            username: null,
            location: null,
            avatar: null
          };
        });

      }).catch(error => {
        Alert.alert('Error adding meet participants to user document.', JSON.stringify(error, null, 2));
      });


    });

    this.app.service('meets').on('removed', removedMeet => {
      this.app.service('users').update(this.user._id,
          { $set: { activeMeet: null } })
      .then(result => {
        this.meetData = [];
        // Stop watching client location
        navigator.geolocation.clearWatch(this.locationWatchId);
        this.locationWatchId = null;
      }).catch(error => {
        Alert.alert('Error removing meet participants from user document.', JSON.stringify(error, null, 2));
      });

    });

    if (this.app.get('accessToken')) {
      this.isAuthenticated = this.app.get('accessToken') !== null;
    }
  }

  connect() {
    this.isConnecting = true;

    this.app.io.on('connect', () => {
      this.isConnecting = false;

      this.authenticate().then(() => {
        console.log('authenticated after reconnection');
      }).catch(error => {
        console.log('error authenticating after reconnection', error);
      });
    });

    this.app.io.on('disconnect', () => {
      console.log('disconnected');
      this.isConnecting = true;
    });
  }

  createAccount(email, username, password) {
    const userData = {
      email,
      username,
      password,
      friends : [],
      location: null,
      activeMeet: null,
      friendRequests : [],
      meetRequests: []
    };
    return this.app.service('users').create(userData).then((result) => {
      return this.authenticate(Object.assign(userData, {strategy: 'local'}))
    });
  }

  login(email, password) {
    const payload = {
      strategy: 'local',
      email,
      password
    };
    return this.authenticate(payload);
  }

  authenticate(options) {
    options = options ? options : undefined;
    return this._authenticate(options).then(user => {
      console.log('authenticated successfully', user._id, user.email);
      this.user = user;
      this.isAuthenticated = true;
      return Promise.resolve(user);
    }).catch(error => {
      console.log('authenticated failed', error.message);
      console.log(error);
      return Promise.reject(error);
    });
  }

  _authenticate(payload) {
    return this.app.authenticate(payload)
      .then(response => {
        return this.app.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        return this.app.service('users').get(payload.userId);
      }).catch(e => Promise.reject(e));
  }

  promptForLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel', onPress: () => {
        }, style: 'cancel'
        },
        {text: 'Yes', onPress: this.logout, style: 'destructive'},
      ]
    );
  }

  logout() {
    this.app.logout();
    this.skip = 0;
    this.messages = [];
    this.meetData = [];
    this.users = [];
    this.user = null;
    this.isAuthenticated = false;
  }

  loadMessages(loadNextPage) {
    let $skip = this.skip;

    const query = {query: {$sort: {createdAt: -1}, $skip}};

    return this.app.service('messages').find(query).then(response => {
      const messages = [];
      const skip = response.skip + response.limit;

      for (let message of response.data) {
        messages.push(this.formatMessage(message));
      }

      console.log('loaded messages from server', JSON.stringify(messages, null, 2));
      if (!loadNextPage) {
        this.messages = messages;
      } else {
        this.messages = this.messages.concat(messages);
      }
      this.skip = skip;
      this.hasMoreMessages = response.skip + response.limit < response.total;

    }).catch(error => {
      console.log(error);
    });
  }

  //Transform messages to the format required by Chat.js
  formatMessage(message) {
      return {
        _id: message._id,
        text: message.text,
        position: message.user._id.toString() === this.user._id.toString() ? 'left' : 'right',
        createdAt: message.createdAt,
        user: {
          _id: message.user._id ? message.user._id : '',
          name: message.user.username,
          avatar: message.user.avatar
        }
      };
  }

  deleteMessage(messageToRemove) {
    let messages = this.messages;
    let idToRemove = messageToRemove.id ? messageToRemove.id : messageToRemove._id;

    messages = messages.filter(function (message) {
      return message.id !== idToRemove;
    });
    this.messages = messages;
  }

  sendMessage(messages = {}, rowID = null) {
    this.app.service('messages').create({
      user: {
        _id: this.user._id,
        email: this.user.email,
        username: this.user.username,
        avatar: this.user.avatar
      },
      text: messages[0].text
    }).then(result => {
        console.log('message created!');
        }).catch((error) => {
          console.log('ERROR creating message');
          console.log(error);
      });
    }

  sendMeetRequest(friend) {
    this.app.service('meet-requests').create({
      fromUser: {
        _id: this.user._id,
        email: this.user.email,
        username: this.user.username,
        avatar: this.user.avatar
      },
      toUser: {
        _id: friend._id,
        email: friend.email,
        username: friend.username,
        avatar: friend.avatar,
        hasAccepted: false
      }
    }).then(result => {
      console.log('meet request sent!');
    }).catch(error => {
      console.log('Error sending meet request');
      console.log(error);
    });
  }

  deleteMeetRequest(requestToRemove) {
    this.app.service('meet-requests').remove(requestToRemove._id);
  }

  activateMeet(request) {
    this.app.service('meets').create({
      participants: [
          request.fromUser._id,
          request.toUser._id
      ]
    }).then(result => {
      console.log('Meet activated!');
      this.app.service('meet-requests').remove(request._id)
      .then(result => {
        console.log('Successfully removed accepted meet request.');
      }).catch(error => {
        console.log('Error removing accepted meet request.');
      })
    }).catch(error => {
      console.log('Error activating meet.', error);
    })

  }

  removeFriend(friend) {
    this.app.service('users').update(this.user._id,
      { $pull :{ friends: { _id : friend._id } } } )
      .then(result => {
      }).catch(error => {
        Alert.alert('Error removing friends', JSON.stringify(error, null, 2));
      })

  }

  cancelMeet(meet) {
    if(this.user.activeMeet == null) {
      Alert.alert('No meet currently in progress.');
    } else {
        this.app.service('meets').remove(meet._id)
        .then(result => {
          Alert.alert('Successfully cancelled meet.');
        }).catch(error => {
          Alert.alert('Error cancelling meet.');
        });
    }
  }

  updateLocation(lat, lng) {
    this.app.service('users').update(this.user._id,
        { $set: { location: { latitude: lat, longitude: lng } } })
    .then(result => {
    }).catch(error => {
      Alert.alert('Error updating user location.', JSON.stringify(error, null, 2));
    });
  }

   /*
      Updates the observable array users when it is Called
      Queries the database and returns an array of users that are in he database
      but not the current user
      Used to retrieve the current users so our search can filter through users
   */
   loadUsers(){
      const query = {query: {$limit:100, username: {$ne: this.user.username}}};

      this.app.service('users').find(query)
         .then(response => {
            const users = [];
            for(let user of response.data){
               users.push(user);
            }
            console.log(users);
            this.users = users;
         }).catch(error => {
            console.log(error);
         });
   }

  sendFriendRequest(toid,tousername,toemail,toavatar) {
   this.app.service('friend-requests').create({
     fromUser: {
       _id: this.user._id,
       email: this.user.email,
       username: this.user.username,
       avatar: this.user.avatar
     },
     toUser: {
       _id: toid,
       email: toemail,
       username: tousername,
       avatar: toavatar,
       hasAccepted: false
     }
   }).then(result => {
     console.log('friend request sent!');
   }).catch(error => {
     console.log('Error sending friend request');
     console.log(error);
   });

 }

 acceptFriendRequest(tuser){
   this.app.service('friend-requests').update(tuser._id,
   { $set: { hasAccepted: true } })
   .then(result => {

   }).catch(error =>{
     Alert.alert('Error', "Error while updating friend in this user", JSON.stringify(error,null,2));
   });



  {this.declineFriendRequest(tuser)}
 }

 cancelFriendRequest(fuser){
   this.app.service('friend-requests').remove(fuser._id);

 }

 declineFriendRequest(tuser){
   this.app.service('friend-requests').remove(tuser._id);

 }


}
