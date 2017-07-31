import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default class CabinetScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Cabinet"
    });

    render() {
        return <View><Text>It's an app.</Text></View>;
    }
}
