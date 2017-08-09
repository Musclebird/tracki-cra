import { Col, Grid, Row } from 'react-native-easy-grid';
import {
    Container,
    Content,
    Form,
    Header,
    Icon,
    Input,
    Item,
    Label,
    Button as NativeButton,
    Thumbnail
} from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from 'react-native';
import { default as DomainStore } from '../stores/DomainStore';
import { ImagePicker } from 'expo';
import PhotoButton from '../components/PhotoButton';

export default class CabinetFormScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        let editing = false;
        let saveEnabled = false;
        let saveHandler = null;
        if (navigation.state && navigation.state.params) {
            editing = navigation.state.params.record != null;
            saveEnabled = navigation.state.params.saveEnabled;
            saveHandler = navigation.state.params.saveHandler;
        }
        return {
            title: editing ? `Edit ${navigation.state.params.record.name} ` : 'Add to Cabinet',
            headerRight: (
                <Button title={editing ? 'Update' : 'Save'} disabled={!saveEnabled} onPress={() => saveHandler()} />
            )
        };
    };

    constructor(props) {
        super(props);
        let record = props.navigation.state.params ? props.navigation.state.params.record : null;
        this.state = {
            name: record ? record.name : null,
            defaultMeasurement: record ? record.defaultMeasurement : null,
            photo: record ? record.photo : null,
            defaultDose: record ? record.defaultDose.toString() : null,
            defaultRouteOfAdministration: record ? record.defaultRouteOfAdministration : null,
            notes: record ? record.notes : null,
            record: record,
            isEdit: record != null,
            isValid: false
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            saveHandler: this.onSave
        });
    }

    onSave = () => {
        if (this.state.isValid) {
            let drugState = {
                name: this.state.name,
                defaultMeasurement: this.state.defaultMeasurement,
                defaultDose: parseFloat(this.state.defaultDose),
                defaultRouteOfAdministration: this.state.defaultRouteOfAdministration,
                notes: this.state.notes,
                photo: this.state.photo
            };

            if (this.state.record) {
                this.state.record.set(drugState);
            } else {
                DomainStore.addDrugTypeFromData(drugState);
            }
            this.props.navigation.goBack();
        }
    };

    addPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true
        });

        if (!result.cancelled) {
            this.setState({ photo: result.uri });
        }
    };

    onFormChange(data) {
        this.setState(data, this.validate);
    }

    validate() {
        let valid = false;
        if (this.state.name && this.state.name.length > 0) {
            valid = true;
        }
        if (this.state.valid != valid) {
            this.setState({ isValid: valid });
            this.props.navigation.setParams({ saveEnabled: valid, saveHandler: this.onSave });
        }
    }

    render() {
        return (
            <Content>
                <Form>
                    <Row>
                        <Col style={{ width: 120 }}>
                            <PhotoButton
                                circle={true}
                                photo={this.state.photo}
                                height={120}
                                width={120}
                                onPress={() => {
                                    this.addPhoto();
                                }}
                                padding={5}
                                borderWidth={0}
                                background="#e0dfe5"
                            />
                        </Col>
                        <Col>
                            <Item stackedLabel>
                                <Label>Name</Label>
                                <Input
                                    name="name"
                                    onChangeText={(text) => this.onFormChange({ name: text })}
                                    value={this.state.name}
                                    placeholder="Soma"
                                    returnKeyType={'next'}
                                    onSubmitEditing={(event) => {
                                        this.refs.measurementInput._root.focus();
                                    }}
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>Default Measurement</Label>
                                <Input
                                    ref="measurementInput"
                                    name="measurement"
                                    onChangeText={(text) => this.onFormChange({ defaultMeasurement: text })}
                                    value={this.state.defaultMeasurement}
                                    placeholder="mg"
                                    returnKeyType={'next'}
                                    onSubmitEditing={(event) => {
                                        this.refs.doseInput._root.focus();
                                    }}
                                />
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Item stackedLabel>
                                <Label>Default amount</Label>
                                <Input
                                    ref="doseInput"
                                    name="defaultDose"
                                    onChangeText={(text) => this.onFormChange({ defaultDose: text })}
                                    value={this.state.defaultDose}
                                    placeholder="What is your normal dose?"
                                    returnKeyType={'next'}
                                    onSubmitEditing={(event) => {
                                        this.refs.roaInput._root.focus();
                                    }}
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>Default RoA</Label>
                                <Input
                                    ref="roaInput"
                                    name="roa"
                                    onChangeText={(text) => this.onFormChange({ defaultRouteOfAdministration: text })}
                                    value={this.state.defaultRouteOfAdministration}
                                    placeholder="How do you normally consume it? e.g. Oral, IV"
                                    returnKeyType={'next'}
                                    onSubmitEditing={(event) => {
                                        this.refs.notesInput._root.focus();
                                    }}
                                />
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Item stackedLabel last underline={false}>
                                <Label>Notes</Label>
                                <Input
                                    ref="notesInput"
                                    name="notes"
                                    multiline
                                    placeholder="Any notes about this drug in particular?"
                                    style={{ minHeight: 40 }}
                                    onChangeText={(text) => this.onFormChange({ notes: text })}
                                    value={this.state.notes}
                                    returnKeyType={'done'}
                                />
                            </Item>
                        </Col>
                    </Row>
                </Form>
            </Content>
        );
    }
}
