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
            Alert.alert('Confirm Delete', `Are you sure you want to delete ${storeRecord.name}?`, [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => this.state.store.removeDrugType(storeRecord.id),
                    style: 'destructive'
                }
            ]);
        }
    }

    render() {
        if (!this.state.store.isLoaded) {
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
                    renderItem={({ item }) => (
                        <DrugCard
                            name={item.name}
                            measurement={item.defaultMeasurement}
                            photoUri={item.photo}
                            onPressEdit={() => this._navigateEditRecord(item.id)}
                            onPressDelete={() => this._promptForDelete(item.id)}
                        />
                    )}
                />
            </View>
        );
    }
}
