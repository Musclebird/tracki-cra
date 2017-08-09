import { Body, Container, Content, Icon, Left, List, ListItem, Right, Text, Thumbnail } from 'native-base';
import { Button, StyleSheet, View } from 'react-native';

import DatePicker from 'react-native-datepicker';
import { default as DomainStore } from '../stores/DomainStore';
import React from 'react';
import { Spinner } from 'native-base';
import _ from 'lodash';
import { observer } from 'mobx-react';

@observer
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
            store: DomainStore,
            selectedDate: new Date()
        };
    }

    render() {
        if (!this.state.store.isLoaded) {
            return <Spinner />;
        }
        var todayEntry = [];
        this.state.store.drugs.map((drug) => {
            drug.getEntriesForDate(this.state.selectedDate).map((x) => {
                if (x) {
                    todayEntry.push([x, drug]);
                }
            });
        });

        todayEntry = _.sortBy(todayEntry, function(item) {
            return item[0].timestamp;
        });

        return (
            <Content>
                <DatePicker
                    date={this.state.selectedDate}
                    mode="date"
                    placeholder="select date"
                    confirmBtnText="Confirm"
                    showIcon={false}
                    style={{
                        alignSelf: 'stretch',
                        width: '100%'
                    }}
                    duration={200}
                    minDate="2016-01-01"
                    maxDate={new Date()}
                    cancelBtnText="Cancel"
                    onDateChange={(date) => {
                        this.setState({ selectedDate: date });
                    }}
                />
                <List>
                    {todayEntry.map((x) => {
                        var photoUri = x[0].photo || x[1].photo || null;
                        return (
                            <ListItem
                                key={x[0].timestamp.getTime()}
                                avatar={photoUri != null}
                                onPress={() => {
                                    this.props.navigation.navigate('EntryForm', { record: x[0], drug: x[1] });
                                }}
                            >
                                {photoUri ? (
                                    <Left>
                                        <Thumbnail small source={{ uri: photoUri }} />
                                    </Left>
                                ) : null}
                                <Body>
                                    <Text>{x[1].name}</Text>
                                    <Text note>{x[0].timestamp.toLocaleTimeString()}</Text>
                                </Body>
                                <Right>
                                    <Text note>
                                        {x[0].dose} {x[0].measurement}
                                    </Text>
                                </Right>
                            </ListItem>
                        );
                    })}
                </List>
            </Content>
        );
    }
}
