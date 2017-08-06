/* THIS IS THE MAIN ENTRY POINT!
   STICK TO THE SRC FOLDER AND LEAVE THIS FILE AS EMPTY AS YOU CAN! */

import { StyleSheet, Text, View } from 'react-native';

import MainNavigator from './src/containers/MainNavigator';
import React from 'react';
import { Root } from 'native-base';

var styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'white'
    }
});

export default class App extends React.Component {
    async componentWillMount() {
        await Expo.Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
        });
    }
    render() {
        return (
            <Root style={styles.main}>
                <MainNavigator />
            </Root>
        );
    }
}
