import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
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
import Modal from 'react-native-modal';

let Dimensions = require('Dimensions');
let SCREEN_WIDTH = Dimensions.get('window').width; //宽
let SCREEN_HEIGHT = Dimensions.get('window').height; //高

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      alert_message_visible: false,
      repeat_messages: [],
      search_visible: false,
      search_result: [],
      searchText: '',
      searchDay: '',
      alert_repeat: false,
      alert_search: false,
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
    });
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
    console.log('(((((((((((((((())))))))))))))))');
    console.log(info);
    let tampMessages = [];
    for (let i in this.state.messages) {
      if (this.state.messages[i].id != info.deleteMessageId) {
        tampMessages.push(this.state.messages[i]);
      }
    }
    this.setState({
      messages: tampMessages,
      alert_message_visible: this.state.alert_repeat || this.state.alert_search,
    });
  };

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
        zoomLevel: 19,
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
      distance: 1000,
      days: 1000000,
      filter_text: '',
    };
    Request.get({url: Api.get_messages_by_km, data: query})
      .then(res => {
        this.setState({messages: res.result});
      })
      .catch(error => {
        console.log(error);
      });
  };

  get_repeat_messages = message => {
    query = {
      latitude: message.latitude,
      longitude: message.longitude,
      distance: 2,
      days: 1000000,
      filter_text: '',
    };
    Request.get({url: Api.get_messages_by_km, data: query})
      .then(res => {
        if (res.status == 0) {
          if (res.sum > 1) {
            this.setState({
              alert_message_visible: true,
              repeat_messages: res.result,
              alert_repeat: true,
              alert_search: false,
            });
          } else {
            Actions.show_message({messageId: message.id, parent: 'mapInfo'});
          }
        } else {
          Alert.alert('提醒', '网络错误，稍后重试');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  search_messages = current_position => {
    if (this.state.searchText.length == 0 && this.state.searchDay.length == 0) {
      Alert.alert('提醒', '内容不能为空');
      return;
    }
    query = {
      latitude: current_position.latitude,
      longitude: current_position.longitude,
      distance: 1000,
      days: this.state.searchDay,
      filter_text: this.state.searchText,
    };
    Request.get({url: Api.get_messages_by_km, data: query})
      .then(res => {
        if (res.status == 0) {
          if (res.sum == 0) {
            Alert.alert('提醒', '没有搜到相关结果');
          } else {
            this.setState({
              search_result: res.result,
              alert_message_visible: true,
              alert_search: true,
              alert_repeat: false,
            });
          }
        } else {
          Alert.alert('提醒', res.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  auto_alert_height = sum_length => {
    let sum_height = 350;
    sum_height = (sum_length + 1) * 43.75;
    return Math.min(sum_height, 393.75);
  };
  render_alert_message = () => {
    let title = '';
    if (this.state.alert_repeat) {
      resultData = this.state.repeat_messages;
      title = '该位置下有' + resultData.length + '条留言';
    } else if (this.state.alert_search) {
      resultData = this.state.search_result;
      title = '搜到' + resultData.length + '条留言';
    } else {
      resultData = [];
    }
    let repeat_message = [];
    for (let i in resultData) {
      repeat_message.push(
        <TouchableOpacity
          key={resultData[i].id}
          activeOpacity={0.7}
          onPress={() => {
            this.setState({alert_message_visible: false});
            Actions.show_message({
              messageId: resultData[i].id,
              parent: 'mapInfo',
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderColor: '#ccc',
            }}>
            <Image
              source={{
                uri: Api.root + resultData[i].user_avatar,
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                marginLeft: 5,
                marginRight: 5,
                marginTop: 5,
                marginBottom: 5,
              }}
            />
            <View>
              <Text>{resultData[i].content}</Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#969696',
                  }}>
                  {resultData[i].user_nickname + ' '}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#969696',
                  }}>
                  {resultData[i].created_at}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>,
      );
    }
    return (
      <View>
        <Modal
          isVisible={this.state.alert_message_visible}
          backdropColor={'black'}
          backdropOpacity={0.6}
          onBackdropPress={() =>
            this.setState({
              alert_message_visible: false,
              alert_repeat: false,
              alert_search: false,
            })
          }
          animationOut="zoomOutUp"
          animationInTiming={100}
          animationOutTiming={10}
          backdropTransitionInTiming={100}
          backdropTransitionOutTiming={100}
          deviceHeight={SCREEN_HEIGHT * 1.1}
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: SCREEN_HEIGHT * 0.15,
          }}>
          <View
            style={{
              height: this.auto_alert_height(resultData.length),
              width: SCREEN_WIDTH * 0.8,
              backgroundColor: 'white',
              alignSelf: 'center',
              paddingLeft: 15,
              paddingRight: 5,
              paddingBottom: 10,
              paddingTop: 10,
              borderRadius: 4,
              borderColor: 'rgba(0, 0, 0, 0.1)',
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    marginBottom: 10,
                  }}>
                  {title}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  alignItems: 'flex-end',
                }}
                onPress={() => {
                  this.setState({
                    alert_repeat: false,
                    alert_search: false,
                    alert_message_visible: false,
                  });
                }}>
                <Image
                  source={require('../icons/close.png')}
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                // flexDirection: 'row',
                flex: 8,
              }}>
              <ScrollView>{repeat_message}</ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  render_search = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 10,
          left: 20,
          right: 0,
          flexDirection: 'row',
        }}>
        <TextInput
          ref="inputLogin"
          style={{
            flex: 4,
            color: 'gray',
            fontSize: 12,
            borderBottomWidth: 2,
            borderColor: '#50adaa',
          }}
          placeholder="内容"
          placeholderTextColor="gray"
          underlineColorAndroid="transparent"
          onChangeText={text => {
            this.setState({searchText: text});
          }}
          selectTextOnFocus={true}
          value={this.state.searchText}
        />
        <TextInput
          ref="inputLogin"
          style={{
            flex: 2,
            color: 'gray',
            fontSize: 12,
            borderBottomWidth: 2,
            borderColor: '#50adaa',
            marginLeft: 4,
          }}
          placeholder="时间(例：3)"
          placeholderTextColor="gray"
          underlineColorAndroid="transparent"
          onChangeText={text => {
            let reg = new RegExp('^[0-9]*$');
            if (reg.test(text)) {
              this.setState({searchDay: text});
            }
          }}
          selectTextOnFocus={true}
          keyboardType={'phone-pad'}
          value={this.state.searchDay}
        />
        <TouchableOpacity
          onPress={() => {
            this.search_messages(this._position);
          }}
          activeOpacity={0.7}
          style={{
            flex: 1,
          }}>
          <Image
            style={{
              alignItems: 'flex-end',
              marginTop: 10,
              width: 30,
              height: 30,
            }}
            source={require('../icons/search.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };

  //按经纬度来设置key，防止key重复，减少刷新页面次数
  getKey = coordinate => {
    return coordinate.latitude.toString() + coordinate.longitude.toString();
  };


  render() {
    const markers = this.state.messages.map(item => (
      <MapView.Marker
        // key={this.getKey({latitude: item.latitude, longitude: item.longitude})}
        key={item.id}
        icon={() => (
          <Image
            source={{uri: Api.root + item.user_avatar}}
            style={{
              width: 30,
              height: 30,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: '#999999',
            }}
          />
        )}
        coordinate={{latitude: item.latitude, longitude: item.longitude}}
        infoWindowDisabled
        onPress={() => {
          // Actions.show_message({messageId: item.id, parent: 'mapInfo'});
          this.get_repeat_messages({
            latitude: item.latitude,
            longitude: item.longitude,
            id: item.id,
          });
        }}
      />
    ));
    return (
      <View style={styles.container}>
        <Toast ref="toast" />

        <MapView
          style={StyleSheet.absoluteFill}
          ref={ref => (this.mapView = ref)}
          showsScale
          showsZoomControls={false}
          zoomLevel={20}
          onStatusChangeComplete={this.onStatusChangeComplete}>
           {markers}
        </MapView>
        {this.render_search()}
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
          {this.render_alert_message()}
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
