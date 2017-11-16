import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { default as DomainStore } from '../stores/DomainStore';
import { Icon, Container, Header, Content, List, ListItem, Separator } from 'native-base';


export default class SettingsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Settings',
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name="ios-ionitron-outline"
                style={{
                    color: tintColor
                }}
            />
        )
    });

    render() {
        return (
            // <View>
            //     <Text>It's an app.</Text>
            //     <Text>Really you're just in a debug area.</Text>

            //     <Button
            //         title="Add 50 entries to cabinet"
            //         onPress={() => {
            //             DomainStore.debugMassAdd(50);
            //         }}
            //     />

            //     <Button
            //         title="Add 500 entries to cabinet"
            //         onPress={() => {
            //             DomainStore.debugMassAdd(500);
            //         }}
            //     />
            //     <Button
            //         title="Clear all cabinet entries"
            //         onPress={() => {
            //             DomainStore.clearAll();
            //         }}
            //     />
            // </View>

            <Container>
                <Header />
                <Content>
                    <Separator bordered>
                        <Text>FORWARD</Text>
                    </Separator>
                    <ListItem >
                        <Text>Aaron Bennet</Text>
                    </ListItem>
                    <ListItem>
                        <Text>Claire Barclay</Text>
                    </ListItem>
                    <ListItem last>
                        <Text>Kelso Brittany</Text>
                    </ListItem>
                    <Separator bordered>
                        <Text>MIDFIELD</Text>
                    </Separator>
                    <ListItem>
                        <Text>Caroline Aaron</Text>
                    </ListItem>
                </Content>
            </Container>
        );
    }
}
