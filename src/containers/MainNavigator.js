import { TabNavigator, StackNavigator } from "react-navigation";
import AboutScreen from "../screens/AboutScreen";
import { StyleSheet, Text, View, Color } from "react-native";

let styles = StyleSheet.create({
    tabStyle: {
        backgroundColor: "rgba(247, 247, 247, 0)"
    },
    headerStyle: {
        backgroundColor: "rgba(247, 247, 247, 0)"
    }
});

const MainNavigator = TabNavigator(
    {
        About: { screen: AboutScreen }
    },
    {
        tabBarOptions: {
            style: styles.tabStyle
        }
    }
);

const MainStackWrapper = StackNavigator(
    {
        MainTabContainer: {
            screen: MainNavigator
        }
    },
    {
        headerMode: "none",
        navigationOptions: {
            headerStyle: styles.headerStyle
        }
    }
);

export default MainStackWrapper;
