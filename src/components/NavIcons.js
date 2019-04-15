import React from 'react'
import {StyleSheet, TouchableOpacity, Text} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';

export default {
  closeButton (goBack) {
    return (
      <TouchableOpacity onPress={() => goBack()}>
        <Icon name='close' style={styles.close}/>
      </TouchableOpacity>
    )
  },

  settingsButton (navigate) {
    return (<TouchableOpacity onPress={() => navigate('Settings')}>
        <Icon name='settings' style={styles.settings}/>
      </TouchableOpacity>
    )
  },

  menuButton (navigate) {
    return (<TouchableOpacity onPress={() => navigate('MainMenu')}>
        <Icon name='menu' style={styles.menu}/>
      </TouchableOpacity>
    )
  },

  addfriendButton (navigate) {
    return (<TouchableOpacity onPress={() => navigate('FriendSearch')} style={styles.addfriend}>
        <Text style={styles.addfriendtext}>add friend</Text>
        <Icon name='face' style={styles.addfriendicon}/>
      </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  close: {
    marginLeft: 10,
    fontSize: 28,
    color: '#000',
  },
  settings: {
    marginRight: 10,
    fontSize: 28,
    color: '#555',
  },
  menu: {
    marginLeft: 10,
    fontSize: 28,
    color: '#555',
  },
  addfriendicon: {
    marginRight: 10,
    fontSize: 20,
    color: '#555',
  },
  addfriendtext: {
    fontSize: 10,
    color: '#555',
    marginRight: 5
  },
  addfriend: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
