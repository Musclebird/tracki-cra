import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default class EntryScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Entries"
    });

    render() {
        return <View><Text>It's an app.</Text></View>;
    }
}
