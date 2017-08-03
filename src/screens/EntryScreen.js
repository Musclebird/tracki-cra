import { StyleSheet, Text, View } from 'react-native';

import { Icon } from 'native-base';
import React from 'react';

export default class EntryScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Entries',
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name="ios-book-outline"
                style={{
                    color: tintColor
                }}
            />
        )
    });

    render() {
        return (
            <View>
                <Text>It's an app.</Text>
            </View>
        );
    }
}
