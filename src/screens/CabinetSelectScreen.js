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
export default class CabinetSelectScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Select'
    });

    constructor(params) {
        super(params);
        this.state = {
            store: DomainStore,
            search: ''
        };
        this._navigateToForm = this._navigateToForm.bind(this);
    }

    _navigateToForm(id) {
        this.props.navigation.navigate('EntryForm', { drug: this.state.store.getDrugById(id) });
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
                            onPress={() => {
                                this._navigateToForm(item.id);
                            }}
                            timestamp={item.latestEntry ? item.latestEntry.timestamp : null}
                        />
                    )}
                />
            </View>
        );
    }
}
