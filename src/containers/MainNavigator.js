import {TabNavigator, StackNavigator} from "react-navigation";
import AboutScreen from "../screens/AboutScreen";
import CabinetScreen from "../screens/CabinetScreen";
import CabinetFormScreen from "../screens/CabinetFormScreen";
import {StyleSheet, Text, View, Color} from "react-native";

let styles = StyleSheet.create({
    tabStyle: {
        backgroundColor: "rgba(247, 247, 247, 255)"
    },
    headerStyle: {
        backgroundColor: "rgba(247, 247, 247, 255)"
    }
});

const MainNavigator = TabNavigator(
    {
        Cabinet: {screen: CabinetScreen},
        About: {screen: AboutScreen}
    },
    {
        tabBarOptions: {
            style: styles.tabStyle,
            order: ["Entries", "Cabinet", "About"]
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
        }
    },
    {
        navigationOptions: {
            headerStyle: styles.headerStyle
        }
    }
);

export default MainStackWrapper;
