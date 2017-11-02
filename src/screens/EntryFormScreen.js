import { ActionSheet, Container, Content, Form, Header, Input, Item, Label, Button as NativeButton } from 'native-base';
import { Col, Grid, Row } from 'react-native-easy-grid';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from 'react-native';
import { default as DomainStore } from '../stores/DomainStore';
import { ImagePicker } from 'expo';
import { NavigationActions } from 'react-navigation';
import PhotoButton from '../components/PhotoButton';

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
            dose: record ? record.dose.toString() : drug.defaultDose.toString(),
            notes: record ? record.notes : null,
            photo: record ? record.photo : null,
            timestamp: record ? record.timestamp : new Date(),
            measurement: record ? record.measurement : drug.defaultMeasurement,
            routeOfAdministration: record ? record.routeOfAdministration : drug.defaultRouteOfAdministration,
            isEdit: record != null,
            isValid: true,
            record: record
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleSave: this.onSave, saveEnabled: true });
    }

    onSave = () => {
        if (this.state.isValid) {
            var entryData = {
                timestamp: this.state.timestamp,
                dose: parseFloat(this.state.dose),
                photo: this.state.photo,
                routeOfAdministration: this.state.routeOfAdministration,
                measurement: this.state.measurement,
                notes: this.state.notes
            };
            if (this.state.record) {
                this.state.record.set(entryData);
            } else {
                this.state.drug.addEntryFromData(entryData);
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
        ActionSheet.show(
            {
                options: ['Take a photo', 'Choose from library', 'Remove photo', 'Cancel'],
                cancelButtonIndex: 3,
                destructiveButtonIndex: 2,
                title: 'Assign a photo to this entry'
            },
            async (index) => {
                var launchMethod = null;
                switch (index) {
                    case 0:
                        launchMethod = ImagePicker.launchCameraAsync;
                        break;
                    case 1:
                        launchMethod = ImagePicker.launchImageLibraryAsync;
                        break;
                    case 2:
                        this.setState({ photo: null });
                        return;
                    case 3:
                        return;
                }
                let result = await launchMethod({
                    allowsEditing: true
                });

                if (!result.cancelled) {
                    this.setState({ photo: result.uri });
                }
            }
        );
    };

    validate() {
        console.log('Validating state:', this.state);
    }

    render() {
        return (
            <Content>
                <Row>
                    <Col>
                        <PhotoButton
                            photo={this.state.photo}
                            onPress={() => this.addPhoto()}
                            width="100%"
                            height={140}
                        />
                    </Col>
                </Row>
                <Form>
                    <Row>
                        <Col>
                            <Item stackedLabel>
                                <Label>Amount</Label>
                                <Input
                                    name="dose"
                                    onChangeText={this.handleChange}
                                    placeholder="What dose?"
                                    onChangeText={(text) => this.setState({ dose: text })}
                                    value={this.state.dose}
                                />
                            </Item>
                        </Col>
                        <Col>
                            <Item stackedLabel>
                                <Label>Measurement</Label>
                                <Input
                                    name="measurement"
                                    onChangeText={(text) => this.setState({ measurement: text })}
                                    value={this.state.measurement}
                                    placeholder="What unit of measurement?"
                                />
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Item stackedLabel>
                                <Label>Route of Administration</Label>
                                <Input
                                    onChangeText={(text) => this.setState({ routeOfAdministration: text })}
                                    value={this.state.routeOfAdministration}
                                    placeholder="How was it consumed?"
                                />
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Item stackedLabel>
                                <Label>Time of entry</Label>
{/*
                                <DatePicker
                                    date={this.state.timestamp}
                                    mode="datetime"
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
                                        this.setState({ timestamp: date });
                                    }}
                                />
                                */}
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
                                    placeholder="Any notes about this entry in particular?"
                                    style={{ minHeight: 40 }}
                                    onChangeText={(text) => this.setState({ notes: text })}
                                    value={this.state.notes}
                                    returnKeyType={'done'}
                                />
                            </Item>
                            {this.state.record ? (
                                <NativeButton onPress={() => this.deleteRecord()}>
                                    <Text> Delete</Text>
                                </NativeButton>
                            ) : null}
                        </Col>
                    </Row>
                </Form>
            </Content>
        );
    }
}
