import React, {Component} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {autobind} from 'core-decorators';
import {observer} from 'mobx-react/native';
import {Button} from 'react-native-elements';
import NavIcons from '../components/NavIcons';

const baseStyles = require('../baseStyles');

import { NavigationActions } from 'react-navigation';



@autobind @observer
export default class MainMenu extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Menu',
    headerLeft: NavIcons.closeButton(navigation.goBack),
  });

  _showFriendList() {
    this.props.navigation.navigate('FriendList');
  }

  _showFriendRequest() {
     this.props.navigation.navigate('FriendRequest');
 }

  _showMap() {
    this.props.navigation.navigate('MeetView');
  }

  render() {
    const user = this.props.screenProps.store.user;

    if(!user) {
      return null;
    }

    return (
      <View style={baseStyles.container}>
        <View style={styles.topSection}>
          <Button title='Friends'
                  onPress={this._showFriendList}
                  backgroundColor='#48fdf6'
                  color={'black'}
                  buttonStyle={styles.navButton}/>
          <Button title="Friend Requests"
                  onPress={this._showFriendRequest}
                  backgroundColor='#48fdf6'
                  color={'black'}
                  buttonStyle={styles.navButton}/>
          <Button title='Map'
                  onPress={this._showMap}
                  backgroundColor='#48fdf6'
                  color={'black'}
                  buttonStyle={styles.navButton}/>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 15,
  },
  signoutButton: {
    borderRadius: 5,
    borderWidth: 0,
    borderColor: 'black'
  },
  navButton: {
    borderRadius: 5,
    borderWidth: 0,
    borderColor: 'black',
    marginTop: 20,
    width: 150
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 140
  }
});
