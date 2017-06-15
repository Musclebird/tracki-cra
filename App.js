/* THIS IS THE MAIN ENTRY POINT!
   STICK TO THE SRC FOLDER AND LEAVE THIS FILE AS EMPTY AS YOU CAN! */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MainNavigator from "./src/containers/MainNavigator";

var styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "white"
    }
});

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.main}>
                <MainNavigator />
            </View>
        );
    }
}
