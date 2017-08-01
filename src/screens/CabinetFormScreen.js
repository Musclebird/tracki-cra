import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import CabinetStore from "../stores/CabinetStore";
import {Button} from "react-native";
import {Container, Header, Content, Form, Item, Input} from "native-base";

export default class CabinetFormScreen extends Component {
    static navigationOptions = ({navigation}) => {
        var editing = navigation.state.params && navigation.state.params.record;
        return {
            title: editing ? "Edit Entry" : "Add to Cabinet",
            headerRight: (
                <View>
                    <Button
                        title={editing ? "Update" : "Save"}
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
            measurement: record ? record.defaultMeasurement : null,
            record: record,
            isEdit: record != null,
            isValid: true
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.onSave, saveEnabled: true});
    }

    onSave = () => {
        if (this.state.isValid) {
            if (this.state.record) {
                this.state.record.setName(this.state.name);
                this.state.record.setMeasurement(this.state.measurement);
            } else {
                CabinetStore.addDrugType(this.state.name, this.state.measurement);
            }
            this.props.navigation.goBack();
        }
    };

    validate() {
        console.log("Validating state:", this.state);
    }

    render() {
        return (
            <Content>
                <Form>
                    <Item>
                        <Input
                            name="name"
                            onChangeText={this.handleChange}
                            placeholder="Drug Name"
                            onChangeText={text => this.setState({name: text})}
                            value={this.state.name}
                        />
                    </Item>
                    <Item last>
                        <Input
                            name="measurement"
                            onChangeText={text => this.setState({measurement: text})}
                            value={this.state.measurement}
                            placeholder="Default Measurement"
                        />
                    </Item>
                </Form>
            </Content>
        );
    }
}
