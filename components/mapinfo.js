import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {MapView} from 'react-native-amap3d';
import {Geolocation} from 'react-native-amap-geolocation';
import Request from '../lib/Request';
import Api from '../lib/Api';
import Toast from 'react-native-whc-toast';
import Session from '../lib/Session';
import {PermissionsAndroid} from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      location: {
        longitude: 0,
        latitude: 0,
      },
    };
    this.currentUser = null;
    //我的实时位置
    this._position = {
      longitude: 0,
      latitude: 0,
    };

    //中心点坐标
    this.centerPosition = {};
  }
  async requestMultiplePermission() {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ];
      //返回得是对象类型
      const granteds = await PermissionsAndroid.requestMultiple(permissions);
      var data = '是否同意地址权限: ';
      if (granteds['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
        data = data + '是\n';
      } else {
        data = data + '否\n';
      }
      data = data + '是否同意相机权限: ';
      if (granteds['android.permission.CAMERA'] === 'granted') {
        data = data + '是\n';
      } else {
        data = data + '否\n';
      }
      data = data + '是否同意存储权限: ';
      if (granteds['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
        data = data + '是\n';
      } else {
        data = data + '否\n';
      }
    } catch (err) {}
  }

  componentDidMount() {
    this.requestMultiplePermission();
    Geolocation.init({
      android: '21f2e5a2ce0b635a4cabf4d437e70031',
    });
    Geolocation.setOptions({
      interval: 3000,
      distanceFilter: 0,
      background: true,
      reGeocode: true,
    });
    Geolocation.addLocationListener(location => {
     this.updateLocationState(location);
      }
    );
    Geolocation.start();
    Session.getUser().then(user => {
      if (user) {
        this.currentUser = user;
      }
    });

    setTimeout(() => {
      if (this.props.info) {
        this.refs.toast.show(
          this.props.info,
          Toast.Duration.short,
          Toast.Position.bottom,
        );
      }
    }, 500);
  }

  componentWillUnmount() {
    Geolocation.stop();
  }

  componentWillReceiveProps = info => {
    let tampMessages = []
    for(let i in this.state.messages){
      if(this.state.messages[i].id != info.deleteMessageId){
        tampMessages.push(this.state.messages[i])
      }
    }
    this.setState({messages: tampMessages})
  }

  // get_messages

  onStatusChangeComplete = ({nativeEvent}) => {
    // this.refs.toast.close(true);
    this.centerPosition = nativeEvent;
    console.log('中心位置' + this.centerPosition);
    this.get_messages_by_km(this.centerPosition);
    // this.getMarkers(nativeEvent);
  };
  updateLocationState(location) {
    if (location) {
      if (this._position.latitude == 0) {
        this._position = location;
        this._animatedToZGC(this._position, 1);
      } else {
        this._position = location;
      }
    }
  }
  _animatedToZGC = (position, duration) => {
    if (!duration) duration = 500;
    this.mapView.animateTo(
      {
        tilt: 0,
        rotation: 0,
        zoomLevel: 16,
        coordinate: position,
      },
      duration,
    );
  };

  startLocation = () => {
    Geolocation.start();
  };
  stopLocation = () => Geolocation.stop();
  getLastLocation = async () =>
    this.updateLocationState(await Geolocation.getLastLocation());

  get_messages_by_km = current_position => {
    query = {
      latitude: current_position.latitude,
      longitude: current_position.longitude,
    };
    Request.get({url: Api.get_messages_by_km, data: query})
      .then(res => {
        this.setState({messages: res.result});
      })
      .catch(error => {
        console.log(error);
      });
  };

  //按经纬度来设置key，防止key重复，减少刷新页面次数
  getKey = coordinate => {
    return coordinate.latitude.toString() + coordinate.longitude.toString();
  };

  render() {
    const markers = this.state.messages.map(item => (
      <MapView.Marker
        key={this.getKey({latitude: item.latitude, longitude: item.longitude})}
        icon={() => (
          <Image
            source={{uri: Api.root + item.user_avatar}}
            style={{width: 30, height: 30, borderRadius: 50,borderWidth: 1, borderColor: "#999999"}}
          />
        )}
        coordinate={{latitude: item.latitude, longitude: item.longitude}}
        infoWindowDisabled
        onPress={() => {
          Actions.show_message({messageId: item.id,parent: "mapInfo"});
        }}
      />
    ));
    return (
      <View style={styles.container}>
        <Toast ref="toast" />

        <MapView
          style={StyleSheet.absoluteFill}
          ref={ref => (this.mapView = ref)}
          locationEnabled
          showsScale
          showsZoomControls={false}
          zoomLevel={16}
          onStatusChangeComplete={this.onStatusChangeComplete}>
          {markers}
        </MapView>
        <View style={styles.centerImgWrap}>
          <Image
            source={require('../icons/marker.png')}
            style={styles.centerImg}
          />
        </View>
        <View style={styles.navGroup}>
          <View style={{flexGrow: 2}}>
            <TouchableOpacity
              onPress={() => this._animatedToZGC(this._position)}>
              <Image
                style={[styles.imgSm, styles.navCenter]}
                source={require('../icons/location.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={{flexGrow: 3}}>
            <TouchableOpacity
              onPress={() => {
                Session.getUser()
                  .then(user => {
                    if (user) Actions.new_message({position: this._position});
                    else Actions.login({info: '请先登录'});
                  })
                  .catch(error => {});
              }}>
              <Image
                style={[styles.imgSm, styles.navCenter]}
                source={require('../icons/add.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{flexGrow: 2}}>
            <TouchableOpacity
              onPress={() => {
                if (this.currentUser) Actions.me();
                else Actions.login({info: '请先登录'});
              }}>
              <Image
                style={[styles.imgSm, styles.navCenter]}
                source={require('../icons/user.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  centerImgWrap: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  centerImg: {
    marginBottom: 40,
    width: 25.9064,
    height: 40,
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
  navGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  imgSm: {
    height: 40,
    width: 40,
  },
  imgMd: {
    height: 100,
    width: 100,
  },
  navCenter: {
    alignSelf: 'center',
  },
  flex: {
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#6699CC',
    fontWeight: 'bold',
  },
});
