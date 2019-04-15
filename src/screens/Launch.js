import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Button} from 'react-native-elements';
import {autobind} from 'core-decorators';

@autobind
export default class Launch extends Component {
  static navigationOptions = {
    header: null
  };

  _showLogin() {
    this.props.navigation.navigate('Login');
  }

  _showSignup() {
    this.props.navigation.navigate('Signup');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
               <Text style={styles.tagline}>ARchat</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomSection}>
          <Button title='Sign In'
                  onPress={this._showLogin}
                  color='#000'
                  backgroundColor='#89bbfe'
                  buttonStyle={{borderRadius: 5}}/>
          <Button title='Create Account'
                  onPress={this._showSignup}
                  color='#000'
                  backgroundColor='#89bbfe'
                  buttonStyle={{marginTop: 10, borderRadius: 5}}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  logo: {
    resizeMode: 'contain',
    width: 280,
    height: 80
  },
  tagline: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: '200',
    color: 'black',
  },
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flex: 0,
    paddingBottom: 15
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
  },
  outerCircle: {
    borderRadius: 75,
    width: 150,
    height: 150,
    backgroundColor: 'black',
  },
  innerCircle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70,
    width: 140,
    height: 140,
    margin: 2,
    backgroundColor: '#89bbfe'
  }
});
