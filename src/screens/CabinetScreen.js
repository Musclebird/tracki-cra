import React from "react";
import {StyleSheet, View, FlatList, Button, Image} from "react-native";
import {
    ListItem,
    Spinner,
    Container,
    Card,
    CardItem,
    ActionSheet,
    Text,
    Body,
    Left,
    Right,
    Button as NativeBaseButton,
    Icon,
    Content,
    Middle
} from "native-base";

import CabinetStore from "../stores/CabinetStore";
import {NavigationActions} from "react-navigation";
import {observer} from "mobx-react";
import {toJS} from "mobx";

@observer
export default class CabinetScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: "Cabinet",
        headerRight: <Button title="Add" onPress={() => navigation.navigate("CabinetForm")} />,
        tabBarIcon: ({tintColor}) => <Icon name="ios-apps" style={{color: tintColor}} />
    });

    constructor(params) {
        super(params);
        this.state = {
            store: CabinetStore
        };
    }

    render() {
        if (!this.state.store.isLoaded) {
            return (
                <Container
                    style={{
                        justifyContent: "center",
                        alignItems: "center"
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
                <FlatList
                    keyExtractor={item => item.id}
                    data={toJS(this.state.store.drugs)}
                    renderItem={({item}) =>
                        <Card>
                            <CardItem style={{height: 50}}>
                                <Body>
                                    <Text>
                                        {item.name} ({item.defaultMeasurement})
                                    </Text>
                                    <Text note>Last taken x days ago</Text>
                                </Body>
                                <Right>
                                    <NativeBaseButton transparent>
                                        <Icon name="ios-create-outline" />
                                    </NativeBaseButton>
                                </Right>
                            </CardItem>
                            <CardItem cardBody>
                                <Image
                                    source={{uri: "http://thecatapi.com/api/images/get?format=src&type=jpg"}}
                                    style={{height: 200, width: null, flex: 1}}
                                />
                            </CardItem>
                            <CardItem style={{flex: 1, height: 45}}>
                                <Left>
                                    <NativeBaseButton iconLeft primary transparent>
                                        <Icon name="ios-information-circle-outline" />
                                        <Text>Statistics</Text>
                                    </NativeBaseButton>
                                </Left>
                                <Body />
                                <Right>
                                    <NativeBaseButton iconLeft transparent danger>
                                        <Icon name="md-trash" />
                                    </NativeBaseButton>
                                </Right>
                            </CardItem>
                        </Card>}
                />
            </View>
        );
    }
}
