import React, {Component} from 'react';
import {View, ToolbarAndroid, StyleSheet} from 'react-native';
import {autobind} from 'core-decorators';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react/native';
import {StackNavigator,TabNavigator} from 'react-navigation';
import {Tabs} from './config/router';

import {Launch,
        Login,
        Signup,
        Chat,
        Settings,
        FriendList,
        FriendSearch,
        FriendRequest,
        MeetView,
        XRay,
        MainMenu,
} from './screens'

import Store from './Store';

const UnauthenticatedNavigator = StackNavigator({
  Launch: {screen: Launch},
  Login: {screen: Login},
  Signup: {screen: Signup}
}, {mode: 'modal'});

@autobind @observer
export default class Application extends Component {
  constructor(props) {
    super(props);
    this.store = new Store();
  }

  render() {
    return (
      <View style={{flex: 1}}>
         {this.store.isAuthenticated ? <Tabs screenProps={{store: this.store}}/> :
          <UnauthenticatedNavigator screenProps={{store: this.store}}/>}

      </View>
    );
  }
}

const styles = StyleSheet.create({
   toolbar: {
        height: 56,
        backgroundColor: '#89bbfe',
    },
})
