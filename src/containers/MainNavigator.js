import {
    AboutScreen,
    CabinetFormScreen,
    CabinetScreen,
    CabinetSelectScreen,
    EntryFormScreen,
    EntryScreen
} from '../screens/';
import { Color, StyleSheet, Text, View } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

let styles = StyleSheet.create({
    tabStyle: {
        backgroundColor: 'rgba(247, 247, 247, 255)'
    },
    headerStyle: {
        backgroundColor: 'rgba(247, 247, 247, 255)'
    }
});

const MainNavigator = TabNavigator(
    {
        Entries: { screen: EntryScreen },
        Cabinet: { screen: CabinetScreen },
        About: { screen: AboutScreen }
    },
    {
        tabBarOptions: {
            style: styles.tabStyle,
            order: ['Entries', 'Cabinet', 'About']
        }
    }
);

const MainStackWrapper = StackNavigator(
    {
        MainTabContainer: {
            screen: MainNavigator
        },
        CabinetForm: {
            screen: CabinetFormScreen
        },
        CabinetSelect: {
            screen: CabinetSelectScreen
        },
        EntryForm: {
            screen: EntryFormScreen
        }
    },
    {
        navigationOptions: {
            headerStyle: styles.headerStyle
        }
    }
);

export default MainStackWrapper;
