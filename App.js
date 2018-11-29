import { Scene, Router, Stack } from "react-native-router-flux";
import MapInfo from "./components/mapinfo";
import React, { Component } from "react";


export default class App extends Component {
  render() {
    return (
      <Router>
        <Stack
          key="root"
          hideNavBar
        >
          <Scene key="mapInfo" component={MapInfo} initial />
        </Stack>
      </Router>
    );
  }
}
