import React, {Component} from 'react';
import {
  Alert,
  Keyboard,
  TextInput,
  View,
  TouchableWithoutFeedback
} from 'react-native';

import {autobind} from 'core-decorators';
import {observable} from 'mobx';
import {observer} from 'mobx-react/native';
import {Button} from 'react-native-elements';
import NavIcons from '../components/NavIcons';
const baseStyles = require('../baseStyles');
import Utils from '../Utils';

@autobind @observer
export default class Signup extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Create Account',
    headerLeft: NavIcons.closeButton(navigation.goBack)
  });

  @observable email = '';
  @observable username = '';
  @observable password = '';
  @observable loading = false;

  constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;
  }

  onChangeEmail(text) {
    this.email = text;
  }

  onChangePassword(text) {
    this.password = text;
  }

  onChangeUsername(text) {
    this.username = text;
  }

  register() {
    //if (!Utils.validateEmail(this.email) || !Utils.validatePassword(this.password)) {
     // Alert.alert('Please enter a valid email, username or password.');
     // return;
    //}

    const submittedEmail = Utils.validateEmail(this.email);
    const submittedUsername = Utils.validateUsername(this.username);
    const submittedPassword = Utils.validatePassword(this.password);

    if (!submittedEmail.valid) {
      Alert.alert('Invalid Email', submittedEmail.message);
      return;
    }

    if(!submittedUsername.valid) {
      Alert.alert('Invalid Username', submittedUsername.message);
      return;
    }

    if(!submittedPassword.valid) {
      Alert.alert('Invalid Password', submittedPassword.message);
      return;
    }

    this.loading = true;
    this.store.createAccount(this.email, this.username, this.password).catch(error => {
      console.log(error);
      Alert.alert('Error', `${error}`);
      this.loading = false;
    });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={baseStyles.container}>
          <View style={baseStyles.inputs}>
            <View style={baseStyles.inputContainer}>
              <TextInput
                style={[baseStyles.input, baseStyles.darkFont]}
                autoFocus={true}
                placeholder='Email'
                placeholderTextColor='#AAA'
                autoCorrect={false}
                autoCapitalize='none'
                keyBoardType='email-address'
                returnKeyType='next'
                value={this.email}
                onChangeText={this.onChangeEmail}
              />
            </View>
            <View style={baseStyles.inputContainer}>
              <TextInput
                style={[baseStyles.input, baseStyles.darkFont]}
                placeholder='Username'
                placeholderTextColor='#AAA'
                autoCorrect={false}
                autoCapitalize='none'
                returnKeyType='next'
                value={this.username}
                onChangeText={this.onChangeUsername}
              />
            </View>
            <View style={baseStyles.inputContainer}>
              <TextInput
                secureTextEntry={true}
                style={[baseStyles.input, baseStyles.darkFont]}
                placeholder='Password'
                placeholderTextColor='#AAA'
                autoCorrect={false}
                autoCapitalize='none'
                returnKeyType='send'
                value={this.password}
                onChangeText={this.onChangePassword}
              />
            </View>
            <View style={{height: 60}}>
              <Button title='Create Account Now'
                      onPress={this.register}
                      color='#000'
                      backgroundColor='#89bbfe'
                      buttonStyle={{marginTop: 10, borderRadius: 5}}/>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
