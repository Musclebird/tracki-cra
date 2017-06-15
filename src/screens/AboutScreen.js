import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default class AboutScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: "About"
    });

    render() {
        return <View><Text>It's an app.</Text></View>;
    }
}
