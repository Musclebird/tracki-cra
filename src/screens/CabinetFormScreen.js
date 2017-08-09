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
        var editing = navigation.state.params && navigation.state.params.record;
        return {
            title: editing ? `Edit ${navigation.state.params.record.name} ` : 'Add to Cabinet',
            headerRight: (
                <View>
                    <Button
                        title={editing ? 'Update' : 'Save'}
                        //disabled={!navigation.state.params ? true : !navigation.state.params.saveEnabled}
                        onPress={() => navigation.state.params.handleSave()}
                    />
                </View>
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
            isValid: true
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleSave: this.onSave, saveEnabled: true });
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

    validate() {}

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
                                    onChangeText={this.handleChange}
                                    onChangeText={(text) => this.setState({ name: text })}
                                    value={this.state.name}
                                    placeholder="Soma"
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>Default Measurement</Label>
                                <Input
                                    name="measurement"
                                    onChangeText={(text) => this.setState({ defaultMeasurement: text })}
                                    value={this.state.defaultMeasurement}
                                    placeholder="mg"
                                />
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Item stackedLabel>
                                <Label>Default amount</Label>
                                <Input
                                    name="defaultDose"
                                    onChangeText={(text) => this.setState({ defaultDose: text })}
                                    value={this.state.defaultDose}
                                    placeholder="What is your normal dose?"
                                />
                            </Item>
                            <Item stackedLabel>
                                <Label>Default RoA</Label>
                                <Input
                                    name="roa"
                                    onChangeText={(text) => this.setState({ defaultRouteOfAdministration: text })}
                                    value={this.state.defaultRouteOfAdministration}
                                    placeholder="How do you normally consume it? e.g. Oral, IV"
                                />
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Item stackedLabel last underline={false}>
                                <Label>Notes</Label>
                                <Input
                                    name="notes"
                                    multiline
                                    placeholder="Any notes about this drug in particular?"
                                    style={{ minHeight: 40 }}
                                    onChangeText={(text) => this.setState({ notes: text })}
                                    value={this.state.notes}
                                />
                            </Item>
                        </Col>
                    </Row>
                </Form>
            </Content>
        );
    }
}
