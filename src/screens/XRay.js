import React, { Component } from "react";
import {
  AppRegistry,
  Dimensions,
  Alert,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import { Button } from "react-native-elements";
import NavIcons from '../components/NavIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from "../Utils";

const baseStyles = require("../baseStyles");

import Camera from "react-native-camera";

import { NavigationActions } from "react-navigation";

type Props = {
  Accelerometer: Object,
  children: any
};
import { decorator as sensors } from "react-native-sensors";

import RNSimpleCompass from "react-native-simple-compass";
const DEGREE_UPDATE_RATE = 3; // Number of degrees changed before the callback is triggered, for RNSimpleCompass
const ALLOWANCE_DEGREE_NUM = 15; // Allowance to accomodate targetting the user with phone
@autobind @observer
class XRay extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "XRay",
    headerLeft: NavIcons.closeButton(navigation.goBack) 
  });

  constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;
    this.degree = null;
  }

  componentDidMount() {
    RNSimpleCompass.start(DEGREE_UPDATE_RATE, degree => {
      console.log("You are facing", degree);
      this.degree = degree;
    });
  }

  componentWillUnmount() {
    RNSimpleCompass.stop();
  }

  /**
   * Helps to access the Z value of the accelerometer
   */
  componentWillReceiveProps() {
    if (this.props.Accelerometer) {
      this.store.accelerometer = this.props.Accelerometer.z;
    }
  }

  displayTargetAvatar() {
    if (this.store.meetData.length != 0) {
      return this.store.meetData.map(user => {
        if (user._id != this.store.user._id) {
          if (
            user._id != null &&
            user.username != null &&
            user.location != null &&
            user.avatar != null
          ) {
            var bearingToUser = Utils.getBearingsFromLatLonInDegrees(
              this.store.user.location,
              user.location
            );
            if (
              // ensure that the target's avatar is only seen when in this bearing range
              this.degree < bearingToUser + ALLOWANCE_DEGREE_NUM &&
              this.degree > bearingToUser - ALLOWANCE_DEGREE_NUM
            ) {
              return (
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.defaultAvatar}
                />
              );
            } else {
              return (
                <Image
                  source={{ uri: user.avatar }}
                  style={{ opacity: 0 }}
                />
              );
            }
          }
        }
      });
    }
  }

  displayTargetUsername() {
    if (this.store.meetData.length != 0) {
      return this.store.meetData.map(user => {
        if (user._id != this.store.user._id) {
          if (
            this.store.user._id != null &&
            this.store.user.username != null &&
            this.store.user.location != null &&
            this.store.user.avatar != null
          ) {
            return (
              <Text style={{ color: "#FFF" }}>
                {user.username}
              </Text>
            );
          } else {
            <Text style={{ color: "#FFF" }}>
                Your location has not yet been broadcasted...
            </Text>
          }
        }
      });
    }
  }

  displayDistFromTarget() {
    if (this.store.meetData.length != 0) {
      return this.store.meetData.map(user => {
        if (user._id != this.store.user._id) {
          if (
            this.store.user._id != null &&
            this.store.user.username != null &&
            this.store.user.location != null &&
            this.store.user.avatar != null
          ) {
            if (
              // only show the distance from the target user if target's data exists
              user._id != null &&
              user.username != null &&
              user.location != null &&
              user.avatar != null
            ) {
              var distance = Utils.getDistanceFromLatLonInM(
                this.store.user.location,
                user.location
              );
              return (
                <Text style={{ color: "#FFF" }}>
                  {distance.toFixed(2)}m away
                </Text>
              );
            } else {
                return (
                  <Text style={{ color: "#FFF" }}>
                    Cannot fetch target user's location
                  </Text>
                );
            }
          }
        }
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
        >
          { this.displayTargetAvatar() }
          { this.displayTargetUsername() }
          { this.displayDistFromTarget() }
          <Text style={{ color: "#FFF" }}>Degree: {this.degree}</Text>
        </Camera>
      </View>
    );
  }
}

export default sensors({
  Accelerometer: {
    updateInterval: 100
  },
  Gyroscope: false
})(XRay);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  defaultAvatar: {
    resizeMode: "contain",
    width: 100,
    height: 100,
    borderRadius: 50
  },
  close: {
    marginLeft: 10,
    fontSize: 28,
    color: '#000',
  }
});
