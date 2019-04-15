'use strict';
import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  Button,
  TouchableOpacity,
  Image
} from 'react-native';

import {autobind} from 'core-decorators';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react/native';
import {GiftedChat, Message, Avatar, Bubble, LoadEarlier, Send} from 'react-native-gifted-chat';
import NavIcons from '../components/NavIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const maxHeight = Platform.OS === 'ios' ? Dimensions.get('window').height - 65 : Dimensions.get('window').height - 85;

// Render gravatar next to user message
class CustomMessage extends Message {
  renderAvatar() {
    return (
      <Avatar {...this.getInnerComponentProps()} />
    );
  }
}

@observer @autobind
export default class Chat extends Component {

  componentDidMount() {
    this.props.screenProps.store.loadMessages();
  }

renderBubble(props) {
  if(props.isSameUser(props.currentMessage, props.previousMessage) &&
      props.isSameDay(props.currentMessage, props.previousMessage)) {
  return (
       <Bubble
         {...props}
          wrapperStyle={{
            right: {
            backgroundColor: '#dee1e5'
           },
           left: {
             backgroundColor: '#dee1e5'
          }
        }}
        textStyle={{
           left: {
            color: 'black',
           },
          right: {
            color: 'black'
            }
          }}
        />
    );
  }
  return (
    <View>
    <Text style={{color: '#5c626d'}}>{props.currentMessage.user.name}</Text>
      <Bubble
        {...props}
        wrapperStyle={{
            right: {
            backgroundColor: '#dee1e5'
           },
           left: {
             backgroundColor: '#dee1e5'
          }
        }}
        textStyle={{
           left: {
            color: 'black'
           },
          right: {
            color: 'black'
            }
          }}
        />
    </View>
  );
}

// Modify styling of 'load earlier' button
renderLoadEarlier(props) {
  return (
    <LoadEarlier
      {...props}
      wrapperStyle={{
        backgroundColor: '#89bbfe'
      }}
      textStyle={{
        color: 'black'
      }}
    />
  );
}

// Display send button when input box text length > 0
renderSend(props) {
  if(props.text.trim().length > 0) {
   return (
      <TouchableOpacity onPress={() => {
        props.onSend({text: props.text.trim()}, true);
      }}>
        <Image style={styles.sendButton} source={require('../../images/send-button.png')} />
      </TouchableOpacity>
    );
  }
  return null;
}

// render Chat UI with options provided by react-native-gifted-chat API
render() {
  return (
    <View style={styles.container}>
      {this.props.screenProps.store.messages.length > 0 && <GiftedChat
        ref={(c) => this._GiftedMessenger = c}
        user={{_id: this.props.screenProps.store.user._id}}
        messages={this.props.screenProps.store.messages.slice()}
        onSend={this.props.screenProps.store.sendMessage}
        loadEarlier={this.props.screenProps.store.hasMoreMessages}
        onLoadEarlier={this.props.screenProps.store.loadMessages.bind(this, true)}
        keyboardDismissMode='on-drag'
        autoFocus={false}
        maxHeight={maxHeight}
        renderMessage={props => <CustomMessage {...props} />}
        placeholder='Say something!'
        renderBubble={this.renderBubble.bind(this)}
        renderLoadEarlier={this.renderLoadEarlier.bind(this)}
        renderSend={this.renderSend.bind(this)}
      />}

      {this.props.screenProps.store.isConnecting && <View style={styles.banner}>
        <Text style={styles.bannerText}>Reconnecting...</Text>
      </View>}
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white'
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 5,
    backgroundColor: '#E98B50',
    opacity: 0.8
  },
  bannerText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 13,
    textAlign: 'center'
  },
  settings: {
    marginRight: 10
  },
  sendButton: {
    flex: 1,
    resizeMode: 'contain',
    width: 30,
    height: 30,
    marginRight: 10
  },
});
