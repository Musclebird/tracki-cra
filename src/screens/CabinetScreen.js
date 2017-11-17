import { default as DomainStore } from "../stores/DomainStore";
import React, { Component } from "react";
import { View, Button } from "react-native";
import { List, ListItem } from "react-native-elements";
import { observer } from "mobx-react";
import Icon from "react-native-vector-icons/SimpleLineIcons";
@observer
export default class CabinetScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Cabinet",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="drawer" size={26} color={tintColor} />
    ),
    headerRight: (
      <Button title="Add" onPress={() => navigation.navigate("CabinetForm")} />
    )
  });

  constructor(params) {
    super(params);
    this.state = {
      store: DomainStore
    };
  }

  render() {
    return (
      <List>
        {this.state.store.drugs.map((item, i) => (
          <ListItem
            key={item.id}
            title={item.name}
            subtitle={
              item.latestEntry == null ? "Never taken." : "Taken at some point."
            }
          />
        ))}
      </List>
    );
  }
}
