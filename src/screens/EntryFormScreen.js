import { Container, Content, Form, Header, Input, Item } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from 'react-native';
import { default as DomainStore } from '../stores/DomainStore';
import { ImagePicker } from 'expo';
import { NavigationActions } from 'react-navigation';

export default class EntryFormScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        var editing = navigation.state.params && navigation.state.params.record;
        return {
            title: `${editing ? 'Edit' : 'Add'} ${navigation.state.params.drug.name} entry`,
            headerRight: (
                <View>
                    <Button title={editing ? 'Update' : 'Save'} onPress={() => navigation.state.params.handleSave()} />
                </View>
            )
        };
    };

    constructor(props) {
        super(props);
        let drug = props.navigation.state.params.drug;
        let record = props.navigation.state.params ? props.navigation.state.params.record : null;
        this.state = {
            drug: drug,
            dose: record ? record.dose.toString() : null,
            notes: record ? record.notes : null,
            photo: record ? record.photo : null,
            timestamp: record ? record.timestamp : new Date(),
            measurement: record ? record.measurement : drug.defaultMeasurement,
            isEdit: record != null,
            isValid: true
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleSave: this.onSave, saveEnabled: true });
    }

    onSave = () => {
        if (this.state.isValid) {
            if (this.state.record) {
                this.state.record.set({
                    timestamp: this.state.timestamp,
                    dose: parseFloat(this.state.dose),
                    photo: this.state.photo,
                    notes: this.state.notes,
                    measurement: this.state.measurement
                });
            } else {
                this.state.drug.addEntry(
                    this.state.timestamp,
                    parseFloat(this.state.dose),
                    this.state.measurement,
                    this.state.notes,
                    this.state.photo
                );
            }
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'MainTabContainer' })]
            });
            this.props.navigation.dispatch(resetAction);
        }
    };

    onDelete = () => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'MainTabContainer' })]
        });
        this.props.navigation.dispatch(resetAction);
    };

    addPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true
        });

        if (!result.cancelled) {
            this.setState({ photo: result.uri });
        }
    };

    validate() {
        console.log('Validating state:', this.state);
    }

    render() {
        return (
            <Content>
                <Form>
                    <Item>
                        <Input
                            name="dose"
                            onChangeText={this.handleChange}
                            placeholder="Dose"
                            onChangeText={(text) => this.setState({ dose: text })}
                            value={this.state.dose}
                        />
                    </Item>
                    <Item last>
                        <Input
                            name="measurement"
                            onChangeText={(text) => this.setState({ measurement: text })}
                            value={this.state.measurement}
                            placeholder="Measurement"
                        />
                    </Item>

                    <Button
                        title="Add Photo"
                        onPress={() => {
                            this.addPhoto();
                        }}
                    />
                </Form>
            </Content>
        );
    }
}
