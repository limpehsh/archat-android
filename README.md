# ARchat Android - Made with React Native
 
> The goals of ARchat were to build a social app that implemented chat functionality, tracking the updated locations of the users and implementing some form of AR functionality that relates to the task.

> Here is the front end made with React Native targeting Android.

## About

React Native client targeting Android that communicates with the Feathers-based server [archat-backend](https://gitlab.com/limpehsh/archat-backend)

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

2. Install react native CLI

    ```
    npm install -g react-native-cli
    ```

3. Install your dependencies
   
    ```
    cd path/to/archat-fe-reactnative-android;
    ```
    
    ##### npm
    ```
    npm install
    ```
    ##### yarn
    ```
    yarn install
    ```

4. Start the development server

    ```
    react-native start
    ```

5. Start the Android app

    ```
    react-native run-android
    ```

### Connecting to the local server

1. Ensure that the value of 'API_URL' in root/src/Store.js points to your local IP address at port 8080. By default, it is 10.0.2.2:8080, based on the localhost for Android devices

2. Start the server using your own local instance of [archat-backend](https://gitlab.com/limpehsh/archat-backend)

