import {Actions, Scene, Router, Stack} from 'react-native-router-flux';
import MapInfo from './components/mapinfo';
import React, {Component} from 'react';
import Login from './components/login';
import Regist from './components/regist';
import NewMessage from './components/new_message';
import ShowMessage from './components/show_message';
import EditMessage from './components/edit_message';
import Me from './components/me';
import {BackHandler} from 'react-native';
import ListMessage from './components/list_message';
import ListNotices from './components/list_notices';
import ShowNotice from './components/show_notice';


export default class App extends Component {
  onBackPress() {
    cs = Actions.currentScene
    if (cs === 'mapInfo') {
      BackHandler.exitApp();
      return false;
    } 
    else if(cs === 'show_message' || cs === 'list_notices' || cs === 'show_notice'){
      Actions.pop();
      setTimeout(() => {
      Actions.refresh({})
      },500)
      return true;
    }
    else {
      Actions.pop();
      return true;
    }
  }
  render() {
    return (
      <Router backAndroidHandler={this.onBackPress}>
        <Stack key="root" hideNavBar>
          <Scene key="mapInfo" component={MapInfo} initial />
          <Scene key="login" component={Login} />
          <Scene key="regist" component={Regist} />
          <Scene key="new_message" component={NewMessage} />
          <Scene key="edit_message" component={EditMessage} />
          <Scene key="show_message" component={ShowMessage} />
          <Scene key="me" component={Me} />
          <Scene key="list_message" component={ListMessage} />
          <Scene key="list_notices" component={ListNotices} />
          <Scene key="show_notice" component={ShowNotice} />
        </Stack>
      </Router>
    );
  }
}
