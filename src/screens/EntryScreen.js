import {
  Body,
  Container,
  Content,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Text,
  Thumbnail
} from "native-base";
import { Button, StyleSheet, View } from "react-native";

import { default as DomainStore } from "../stores/DomainStore";
import React from "react";
import { Spinner } from "native-base";
import _ from "lodash";
import { observer } from "mobx-react";
import CalendarStrip from "react-native-calendar-strip";
import { LinearGradient } from "expo";
import { isIphoneX } from "react-native-iphone-x-helper";

@observer
export default class EntryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Entries",
    header: null,
    headerRight: (
      <Button
        title="Add"
        onPress={() => navigation.navigate("CabinetSelect")}
      />
    ),

    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="ios-book-outline"
        style={{
          color: tintColor
        }}
      />
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      store: DomainStore,
      selectedDate: new Date()
    };
  }

  render() {
    if (this.state.store.isLoading) {
      return <Spinner />;
    }
    var todayEntry = [];
    this.state.store.drugs.map(drug => {
      drug.getEntriesForDate(this.state.selectedDate).map(x => {
        if (x) {
          todayEntry.push([x, drug]);
        }
      });
    });

    todayEntry = _.sortBy(todayEntry, function(item) {
      return item[0].timestamp;
    });
    return (
      <View
        style={{
          paddingTop: isIphoneX() ? 40 : 20
        }}
      >
        <CalendarStrip
          style={{
            height: 100,
            paddingBottom: 10
          }}
          calendarHeaderStyle={{ color: "white" }}
          calendarAnimation={{ type: "sequence", duration: 30 }}
        />
        <Content style={{ backgroundColor: "transparent" }}>
          <List>
            {todayEntry.map(x => {
              var photoUri = x[0].photo || x[1].photo || null;
              return (
                <ListItem
                  key={x[0].timestamp.getTime()}
                  avatar={photoUri != null}
                  onPress={() => {
                    this.props.navigation.navigate("EntryForm", {
                      record: x[0],
                      drug: x[1]
                    });
                  }}
                >
                  {photoUri ? (
                    <Left>
                      <Thumbnail small source={{ uri: photoUri }} />
                    </Left>
                  ) : null}
                  <Body>
                    <Text>{x[1].name}</Text>
                    <Text note>{x[0].timestamp.toLocaleTimeString()}</Text>
                  </Body>
                  <Right>
                    <Text note>
                      {x[0].dose} {x[0].measurement}
                    </Text>
                  </Right>
                </ListItem>
              );
            })}
          </List>
        </Content>
      </View>
    );
  }
}
