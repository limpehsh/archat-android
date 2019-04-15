import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  Image,
  View,
  Alert
} from 'react-native';
import {Button} from 'react-native-elements';
import NavIcons from '../components/NavIcons';
import { NavigationActions } from 'react-navigation';
import {autobind} from 'core-decorators';
import {observable} from 'mobx';
import {observer} from 'mobx-react/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

@observer @autobind
export default class FriendList extends Component {


 constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;
  }

  generateFriendsList() {
    if(this.store.user != null) {
      return this.store.user.friends.map((friend) =>
        <View key={friend._id} style={styles.friendRow}>
          <Image source={{ uri: friend.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{ friend.username }</Text>
          { this.generateButtons(friend) }
        </View>
      );
    } else {
      return
    }
  }

  generateButtons(friend) {
    if(this.store.user.meetRequests.length == 0) {
     return this.noMeetRequest(friend, false);
    }
    else {
      for (let request of this.store.user.meetRequests) {
        if(friend._id == request.toUser._id) {
          return this.sentMeetRequest(request);
        }
        else if(friend._id == request.fromUser._id) {
          return this.receivedMeetRequest(request);
        }
        else {
          return this.noMeetRequest(friend, true);
        }
      }
    }
  }

  noMeetRequest(friend, disabled) {
    return (
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Button title='Meet'
          onPress={() => this.store.sendMeetRequest(friend)}
          backgroundColor='#aee283'
          color={'black'}
          fontSize={10}
          buttonStyle={styles.button}
          disabled={disabled}
          >
        </Button>
        <Button title='Remove'
          onPress={() => {this.store.removeFriend(friend)}}
          backgroundColor='#e87175'
          color={'black'}
          fontSize={10}
          buttonStyle={styles.button}
          >
        </Button>
      </View>
    );
  }

  sentMeetRequest(request) {
    return (
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Button title='Waiting...'
          onPress={() => {}}
          backgroundColor='#89bbfe'
          color={'black'}
          fontSize={10}
          buttonStyle={styles.button}
          disabled={false}
          >
        </Button>
        <Button title='Cancel'
          onPress={() => {this.store.deleteMeetRequest(request)}}
          backgroundColor='#a1a8ad'
          color={'black'}
          fontSize={10}
          buttonStyle={styles.button}
          >
        </Button>
      </View>
    );
  }

  acceptMeetRequest(request) {
   this.store.activateMeet(request);
   this.props.navigation.navigate('MeetView');
  }

  receivedMeetRequest(request) {
    return (
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Button title='Accept'
          onPress={() => { this.acceptMeetRequest(request) } }
          backgroundColor='#aee283'
          color={'black'}
          fontSize={10}
          buttonStyle={styles.button}
          disabled={false}
          >
        </Button>
        <Button title='Decline'
          onPress={() => { this.store.deleteMeetRequest(request) } }
          backgroundColor='#e87175'
          color={'black'}
          fontSize={10}
          buttonStyle={styles.button}
          >
        </Button>
      </View>
    );
  }


  render() {
    return (
        <ScrollView style={styles.container}>
          { this.generateFriendsList() }
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   flexDirection: 'column',
   paddingTop: 5,
   backgroundColor: 'white'
  },
  button: {
    borderRadius: 5,
    borderWidth: 0,
    borderColor: 'black',
    width: 80,
    height: 30,
    marginRight: 0
  },
  avatar: {
    resizeMode: 'contain',
    width: 25,
    height: 25,
    borderRadius: 50,
    marginRight: 10,
  },
  friendRow: {
    flex: 2,
    flexDirection: 'row',
    margin: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee1e5'
  },
  username: {
    fontSize: 18,
    textAlign: 'left',
    color: 'black'
  }
});
