import {
    ActionSheet,
    Body,
    Card,
    CardItem,
    Container,
    Content,
    Header,
    Icon,
    Input,
    Item,
    Left,
    ListItem,
    Middle,
    Button as NativeBaseButton,
    Right,
    Spinner,
    Text
} from 'native-base';
import { Alert, Button, FlatList, Image, StyleSheet, View } from 'react-native';

import { default as DomainStore } from '../stores/DomainStore';
import DrugCard from '../components/DrugCard';
import { NavigationActions } from 'react-navigation';
import React from 'react';
import Statistics from '../components/Statistics';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

@observer
export default class CabinetScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Cabinet',
        headerRight: <Button title="Add" onPress={() => navigation.navigate('CabinetForm')} />,
        tabBarIcon: ({ tintColor }) => <Icon name="ios-apps" style={{ color: tintColor }} />
    });

    constructor(params) {
        super(params);
        this.state = {
            store: DomainStore,
            search: ''
        };

        // Bind things now!
        this._navigateEditRecord = this._navigateEditRecord.bind(this);
        this._promptForDelete = this._promptForDelete.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    _navigateEditRecord(id) {
        var storeRecord = this.state.store.getDrugById(id);
        if (storeRecord) {
            this.props.navigation.navigate('CabinetForm', {
                record: storeRecord
            });
        } else {
            console.error("Tried to edit record that doesn't exist with ID", id);
        }
    }

    _promptForDelete(id) {
        var storeRecord = this.state.store.getDrugById(id);
        if (storeRecord) {
            Alert.alert(
                'Confirm Delete',
                `Are you sure you want to delete ${storeRecord.name}? All associated entries will be deleted as well!`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'OK',
                        onPress: () => this.state.store.removeDrugType(storeRecord.id),
                        style: 'destructive'
                    }
                ]
            );
        }
    }

    _renderItem(item) {
        var storeEntry = this.state.store.getDrugById(item.id);
        var lastEntry = storeEntry.latestEntry;
        return (
            <DrugCard
                name={item.name}
                measurement={item.defaultMeasurement}
                photoUri={item.photo}
                onPressEdit={() => this._navigateEditRecord(item.id)}
                onPressDelete={() => this._promptForDelete(item.id)}
                timestamp={lastEntry ? lastEntry.timestamp : null}
            >
                <View>
                    <Text>
                        Avg time between use: {(storeEntry.getAverageTimeBetweenEntries(20) / 60 / 60 / 24).toFixed(2)}
                        days
                    </Text>
                    <Text>
                        Longest time between use:
                        {(storeEntry.getLongestTimeBetweenEntries() / 60 / 60 / 24).toFixed(2)} days
                    </Text>
                </View>
            </DrugCard>
        );
    }

    render() {
        if (this.state.store.isLoading) {
            return (
                <Container
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Spinner
                        color="gray"
                        style={{
                            opacity: 0.5
                        }}
                    />
                </Container>
            );
        }

        if (this.state.store.drugs.length <= 0) {
            return (
                <Container
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text>You have nothing in your cabinet.</Text>
                    <View>
                        <NativeBaseButton transparent onPress={() => this.props.navigation.navigate('CabinetForm')}>
                            <Text>Add your first drug?</Text>
                        </NativeBaseButton>
                    </View>
                </Container>
            );
        }

        return (
            <View>
                <Item>
                    <Icon name="ios-search" />
                    <Input
                        placeholder="Search"
                        value={this.state.search}
                        onChangeText={(text) => this.setState({ search: text })}
                    />
                </Item>
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={toJS(this.state.store.searchDrugsByName(this.state.search))}
                    renderItem={({ item }) => this._renderItem(item)}
                    ListFooterComponent={() => <View style={{ height: 50 }} />}
                />
            </View>
        );
    }
}
