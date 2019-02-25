import { Actions,Scene, Router, Stack } from "react-native-router-flux";
import MapInfo from "./components/mapinfo";
import React, { Component } from "react";
import Login from "./components/login";
import Regist from "./components/regist";


export default class App extends Component {
  onBackPress() {
    if (Actions.state.index === 0){
      return false;
    }
    Actions.pop()
    return true
  }
  render() {
    return (
      <Router  backAndroidHandler={this.onBackPress} >
        <Stack key="root" hideNavBar >
          <Scene key="mapInfo" component={MapInfo}  />
          <Scene key="login" component={Login} initial/>
          <Scene key="regist" component={Regist} />
        </Stack>
      </Router>
    );
  }
}
