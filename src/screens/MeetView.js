import React, {Component} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import {autobind} from 'core-decorators';
import {observer} from 'mobx-react/native';
import {Button} from 'react-native-elements';
import NavIcons from '../components/NavIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from '../Utils';

const baseStyles = require('../baseStyles');

import { NavigationActions } from 'react-navigation';

// Phone dimensions
const SCREEN_HEIGHT = 592
const SCREEN_WIDTH = 200
const ASPECT_RATIO = 200/592

// The amount of 'zoom' displayed on screen
const LATITUDE_DELTA = 0.0927
const LONG_DELTA = LATITUDE_DELTA * ASPECT_RATIO


@autobind @observer
export default class MeetView extends Component {

  constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;

    // Sets the initial region as a placeholder 
    // while looking for actual location of user 
    // This shows location as being in Melbourne CBD 
    this.initialRegion = {
      latitude: -37.8136,
      longitude: 144.9631,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONG_DELTA
    };

  }
  /**
   * Function is meant to display the distance away from the user that you are
   * meeting up with. If it is yourself, diplay message indicates that you're there.
   */
  displayDistance(user) {
    if(user._id == this.store.user._id) {
      return `I'm here!`;
    } else {
      if (this.store.user.location.latitude == null ) {
        return `Location cannot be calculated if your own location cannot be determind.`
      } else {
        return `Located ${Utils.getDistanceFromLatLonInM(this.store.user.location, user.location).toFixed(2).toString()} meters away.`;
      }
    }
  }

  displayUsers() {
    return this.store.meetData.map(user => {
      if(user._id != null && user.username != null
          && user.location != null && user.avatar != null) {
        return (
          <MapView.Marker
            key={user._id}
            coordinate={user.location}
            image={{uri: user.avatar}}
            title={user.username}
            description={this.displayDistance(user)}/>
        );
      }
    });
  }

  showCancelButton() {
    if (this.store.meetData && this.store.meetData.length) {
      return (
        <Button title='Cancel Meet'
                onPress={() => {this.store.cancelMeet(this.store.user.activeMeet)}}
                backgroundColor='#e87175'
                color={'black'}
                buttonStyle={styles.cancelButton}/>
      );
    }
  }

  showXRayButton() {
    if (this.store.meetData && this.store.meetData.length) {
      return (
        <Button title={<Text style={{fontSize: 30}}>AR</Text>}
                onPress={() => {this.props.navigation.navigate('XRay')}}
                backgroundColor='#34E0B9'
                color={'black'}
                buttonStyle={styles.xrayButton}/>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={ this.initialRegion }
        >
          { this.displayUsers() }
        </MapView>
        { this.showCancelButton() }
        { this.showXRayButton() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    resizeMode: 'contain',
    width: 100,
    height: 100,
    borderRadius: 50
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 20
  },
  pinText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 20,
  },
  xrayButton: {
    position: 'absolute',
    height: 75,
    width: 75,
    bottom: 8,
    right: 8,
    borderRadius: 40
  }
});
