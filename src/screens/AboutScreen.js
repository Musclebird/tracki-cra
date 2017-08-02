import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { default as DomainStore } from '../stores/DomainStore';
import { Icon } from 'native-base';

export default class AboutScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'About',
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name="ios-ionitron-outline"
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
                <Text>Really you're just in a debug area.</Text>

                <Button
                    title="Add 50 entries to cabinet"
                    onPress={() => {
                        DomainStore.debugMassAdd(50);
                    }}
                />

                <Button
                    title="Add 500 entries to cabinet"
                    onPress={() => {
                        DomainStore.debugMassAdd(500);
                    }}
                />
                <Button
                    title="Clear all cabinet entries"
                    onPress={() => {
                        DomainStore.clearAll();
                    }}
                />
            </View>
        );
    }
}
