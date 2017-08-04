import { Button, StyleSheet, Text, View } from 'react-native';

import { default as DomainStore } from '../stores/DomainStore';
import { Icon } from 'native-base';
import React from 'react';
import { Spinner } from 'native-base';
import _ from 'lodash';

export default class EntryScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Entries',
        headerRight: <Button title="Add" onPress={() => navigation.navigate('CabinetSelect')} />,

        tabBarIcon: ({ tintColor }) => (
            <Icon
                name="ios-book-outline"
                style={{
                    color: tintColor
                }}
            />
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            store: DomainStore
        };
    }

    render() {
        if (!this.state.store.isLoaded) {
            return <Spinner />;
        }
        var todayEntry = [];
        this.state.store.drugs.map((drug) => {
            drug.getEntriesForDate(new Date()).map((x) => {
                if (x) {
                    todayEntry.push([x, drug]);
                }
            });
        });

        todayEntry = _.sortBy(todayEntry, function(item) {
            return item[0].timestamp;
        });

        return (
            <View>
                {todayEntry.map((x) => {
                    return (
                        <Text>
                            {x[0].timestamp.toString()} {x[1].name}
                        </Text>
                    );
                })}
            </View>
        );
    }
}
