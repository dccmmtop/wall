import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
  CheckBox,
  ScrollView,
  FlatList,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Request from '../lib/Request';
import Session from '../lib/Session';
import Api from '../lib/Api';
import Toast from 'react-native-whc-toast';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';

const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

let Dimensions = require('Dimensions');
let SCREEN_WIDTH = Dimensions.get('window').width; //宽
let SCREEN_HEIGHT = Dimensions.get('window').height; //高

export default class Me extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      isVisible: false,
      newNickname: '',
      oldPassword: '',
      newPassword: '',
      newPasswordComfirm: '',
      updatePasswordModal: false,
    };
  }
  componentDidMount = () => {
    Session.getUser()
      .then(user => {
        console.log(user);
        if (user) {
          this.setState({user: user, newNickname: user.nickname});
        }
      })
      .catch(error => {});
  };

  exitApp = () => {
    Session.logout();
    Actions.mapInfo({info: '你已退出登录'});
  };

  selectImage = () => {
    ImagePicker.launchImageLibrary(options, response => {
      console.log('Response = ', response);
      let formData = new FormData();
      let file = {
        uri: response.uri,
        type: 'multipart/form-data',
        name: 'image.png',
      };
      formData.append('avatar', file);
      formData.append('token', this.state.user.token);
      fetch(Api.uploadAvatar, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(res => {
          let user = this.state.user;
          user.avatar =
            JSON.parse(res._bodyInit).avatar +
            '?time=' +
            Date.parse(new Date());
          console.log(user);
          this.setState({user: user});
          Session.login(
            this.state.user.token,
            this.state.user.nickname,
            this.state.user.email,
            this.state.user.avatar,
          );
        })
        .catch(error => {
          console.log(error);
        });
    });
  };
  updatePassword = () => {
    query = {
      token: this.state.user.token,
      old_password: this.state.oldPassword,
      password: this.state.newPassword,
      password_confirmation: this.state.newPasswordComfirm,
    };
    Request.post({url: Api.updatePassword, data: query})
      .then(res => {
        console.log('=====================');
        console.log(res);
        if (res.status == 0) {
          this.setState({updatePasswordModal: false});
          setTimeout(() => {
            Actions.login({info: '更新成功，请重新登录'});
          }, 500);
        } else {
          this.setState({updatePasswordModal: false});
          Alert.alert('提醒', res.message);
        }
      })
      .catch(error => {
        this.setState({updatePasswordModal: false});
        Alert.alert('提醒', error);
      });
  };
  updatePasswordModal = () => {
    return (
      <View>
        <Modal
          isVisible={this.state.updatePasswordModal}
          backdropColor={'black'}
          backdropOpacity={0.6}
          deviceHeight={SCREEN_HEIGHT * 1.2}
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: SCREEN_HEIGHT * 0.2,
          }}>
          <View style={{flex: 1}}>
            <View
              style={{
                width: SCREEN_WIDTH * 0.8,
                height: 250,
                backgroundColor: 'white',
                paddingLeft: 15,
                paddingRight: 15,
                paddingBottom: 10,
                paddingTop: 25,
                alignSelf: 'center',
                borderRadius: 8,
              }}>
              <TextInput
                style={[styles.inputContent]}
                placeholder="旧密码"
                placeholderTextColor="gray"
                underlineColorAndroid="transparent"
                onChangeText={text => {
                  this.setState({oldPassword: text});
                }}
                value={this.state.oldPassword}
                selectTextOnFocus={true}
                secureTextEntry
                maxLength={16}
              />
              <TextInput
                style={[styles.inputContent]}
                placeholder="新密码"
                placeholderTextColor="gray"
                underlineColorAndroid="transparent"
                onChangeText={text => {
                  this.setState({newPassword: text});
                }}
                value={this.state.newPassword}
                selectTextOnFocus={true}
                secureTextEntry
                maxLength={16}
              />
              <TextInput
                style={[styles.inputContent]}
                placeholder="确认密码"
                placeholderTextColor="gray"
                underlineColorAndroid="transparent"
                onChangeText={text => {
                  this.setState({newPasswordComfirm: text});
                }}
                value={this.state.newPasswordComfirm}
                selectTextOnFocus={true}
                secureTextEntry
                maxLength={16}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({updatePasswordModal: false});
                  }}>
                  <Text style={{color: '#50adaa'}}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginLeft: 30}}
                  onPress={this.updatePassword}>
                  <Text style={{color: '#50adaa'}}>确定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  updateNickname = () => {
    let query = {
      token: this.state.user.token,
      nickname: this.state.newNickname,
    };
    Request.get({url: Api.updateNickname, data: query})
      .then(res => {
        if (res.status == 0) {
          let user = this.state.user;
          user.nickname = this.state.newNickname;
          this.setState({
            isVisible: !this.state.isVisible,
            user: user,
          });
          Session.login(
            this.state.user.token,
            this.state.user.nickname,
            this.state.user.email,
            this.state.user.avatar,
          );
          setTimeout(() => {
            this.refs.toast.show(
              '修改成功!',
              Toast.Duration.short,
              Toast.Position.bottom,
            );
          }, 500);
        } else {
          this.setState({isVisible: false});
          Alert.alert('提醒', res.message.replace(/[A-Z|a-z]+/, ''));
        }
      })
      .catch(error => {
        this.setState({isVisible: false});
        Alert.alert('提醒', error);
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <Toast ref="toast" />
        {/* 导航，返回按钮*/}
        <View style={[styles.back]}>
          <TouchableOpacity
            onPress={() => {
              Actions.pop();
            }}
            style={styles.backBtn}>
            <Image
              style={styles.backImg}
              source={require('../icons/back.png')}
            />
          </TouchableOpacity>
          <Text style={[styles.text, styles.title]}>我的</Text>
        </View>
        <View style={styles.mainGroup}>
          <View style={styles.messageInfo}>
            <View style={[styles.userAvatar]}>
              <TouchableOpacity activeOpacity={0.7} onPress={this.selectImage}>
                <Image
                  style={{height: 90, width: 90, borderRadius: 50}}
                  source={{uri: Api.root + this.state.user.avatar}}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.infoRight, styles.flex1]}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text
                  style={[
                    styles.nicknameText,
                    {alignSelf: 'center', paddingTop: 5, paddingBottom: 5},
                  ]}>
                  {this.state.user.nickname}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    this.setState({
                      isVisible: !this.state.isVisible,
                    });
                  }}
                  style={{
                    alignSelf: 'center',
                  }}>
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      marginLeft: 10,
                      alignSelf: 'center',
                    }}
                    source={require('../icons/edit.png')}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.grayText]}>{this.state.user.email} </Text>
            </View>
          </View>
        </View>

        <View style={styles.itemsGroup}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Actions.list_message();
            }}>
            <View style={styles.items}>
              <View style={[styles.flex1, {justifyContent: 'center'}]}>
                <Text style={{fontSize: 17, alignItems: 'center'}}>
                  我的留言
                </Text>
              </View>
              <View style={[styles.flex1, {justifyContent: 'center'}]}>
                <Image
                  style={{width: 20, height: 20, alignSelf: 'flex-end'}}
                  source={require('../icons/ico-right-arrow.png')}
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.setState({isVisible: !this.state.isVisible});
            }}
            activeOpacity={0.7}>
            <View style={styles.items}>
              <View style={[styles.flex1, {justifyContent: 'center'}]}>
                <Text style={{fontSize: 17, alignItems: 'center'}}>
                  修改昵称
                </Text>
              </View>
              <View style={[styles.flex1, {justifyContent: 'center'}]}>
                <Image
                  style={{width: 20, height: 20, alignSelf: 'flex-end'}}
                  source={require('../icons/ico-right-arrow.png')}
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.selectImage} activeOpacity={0.7}>
            <View style={styles.items}>
              <View style={[styles.flex1, {justifyContent: 'center'}]}>
                <Text style={{fontSize: 17, alignItems: 'center'}}>
                  修改头像
                </Text>
              </View>
              <View style={[styles.flex1, {justifyContent: 'center'}]}>
                <Image
                  style={{width: 20, height: 20, alignSelf: 'flex-end'}}
                  source={require('../icons/ico-right-arrow.png')}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('909090909');
              this.setState({
                updatePasswordModal: !this.state.updatePasswordModal,
              });
            }}>
            <View style={styles.items}>
              <View style={[styles.flex1, {justifyContent: 'center'}]}>
                <Text style={{fontSize: 17, alignItems: 'center'}}>
                  修改密码
                </Text>
              </View>
              <View style={[styles.flex1, {justifyContent: 'center'}]}>
                <Image
                  style={{width: 20, height: 20, alignSelf: 'flex-end'}}
                  source={require('../icons/ico-right-arrow.png')}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 30,
            paddingLeft: 30,
            paddingRight: 30,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={this.exitApp}
            style={{
              backgroundColor: '#d9534f',
              height: 50,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                alignSelf: 'center',
                textAlignVertical: 'center',
              }}>
              退出登录
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Modal
            isVisible={this.state.isVisible}
            backdropColor={'black'}
            backdropOpacity={0.6}
            deviceHeight={SCREEN_HEIGHT * 1.2}
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: SCREEN_HEIGHT * 0.3,
            }}>
            <View style={{flex: 1}}>
              <View
                style={{
                  width: SCREEN_WIDTH * 0.8,
                  height: 150,
                  backgroundColor: 'white',
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingBottom: 10,
                  paddingTop: 25,
                  alignSelf: 'center',
                }}>
                <TextInput
                  style={[styles.inputContent]}
                  placeholder="新的昵称"
                  placeholderTextColor="gray"
                  underlineColorAndroid="transparent"
                  onChangeText={text => {
                    this.setState({newNickname: text});
                  }}
                  value={this.state.newNickname}
                  selectTextOnFocus={true}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({isVisible: false});
                    }}>
                    <Text style={{color: '#50adaa'}}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: 30,
                    }}
                    onPress={this.updateNickname}>
                    <Text style={{color: '#50adaa'}}>确定 </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {this.updatePasswordModal()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    // marginBottom: 20,
  },
  back: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 10,
  },
  backImg: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 18,
  },
  grayText: {
    fontSize: 14,
    color: '#969696',
  },
  redText: {
    fontSize: 12,
    color: '#d81e06',
  },
  mainGroup: {
    marginTop: 7,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    backgroundColor: 'white',
  },

  content: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  footer: {
    flexDirection: 'row',
    height: 50,
  },
  like: {
    width: 40,
    height: 40,
  },
  messageInfo: {
    textAlignVertical: 'center',
    // flexDirection: 'row',
    height: 180,
    alignItems: 'center',
    paddingTop: 20,
  },
  messageCount: {
    flexDirection: 'row',
    marginTop: 5,
  },
  infoRight: {
    // marginLeft: 8,
  },
  nickname: {
    fontSize: 14,
  },
  border: {
    borderWidth: 2,
    borderColor: 'black',
  },
  commentGroup: {
    marginTop: 10,
    paddingLeft: 10,
    backgroundColor: 'white',
    paddingRight: 10,
    paddingBottom: 10,
  },
  commentBtn: {
    backgroundColor: '#50adaa',
    borderColor: '#4cae4c',
    borderRadius: 4,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 30,
  },
  commentText: {
    color: 'white',
    fontSize: 14,
  },

  adviceContent: {
    borderColor: '#c5c5c5',
    borderWidth: 1,
    height: 100,
    //从文本域顶部开始输入文字，而不是中间
    textAlignVertical: 'top',
    padding: 10,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  counterWrap: {
    flexDirection: 'row-reverse',
    backgroundColor: 'white',
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#c5c5c5',
    marginLeft: 10,
    marginRight: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  commentGroupHead: {
    height: 40,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: '#dcdcdc',
  },
  commentGroupBody: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#dcdcdc',
  },
  commentGroupBodyLeft: {},
  commentGroupBodyRight: {
    marginTop: 3,
    marginLeft: 3,
  },
  commentGroupBodyTop: {
    flexDirection: 'row',
  },
  commentGroupBodyBottom: {
    marginTop: 10,
    flexDirection: 'row',
    height: 25,
  },
  hint: {
    marginLeft: 10,
  },
  counter: {
    marginRight: 10,
    marginBottom: 10,
  },
  submit: {
    backgroundColor: '#50adaa',
    borderColor: '#4cae4c',
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  submitText: {
    color: 'white',
  },
  limitGroup: {
    flexDirection: 'row',
    // borderColor: "red",
    // borderWidth: 1,
  },
  limitView: {
    flexDirection: 'row',
    // borderColor: "#ccc",
    // borderWidth: 1,
    // marginLeft: 10,
    // marginRight: 10,
    marginTop: 20,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },
  limitText: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  limitInput: {
    // backgroundColor: "#50adaa",
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
    textAlignVertical: 'center',
    fontSize: 13,
    // marginRight: 10,
  },
  commentFooter: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nicknameText: {
    fontSize: 20,
  },
  itemsGroup: {
    marginTop: 5,
    backgroundColor: 'white',
  },
  items: {
    height: 60,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: '#dcdcdc',
    flexDirection: 'row',
  },
  inputContent: {
    color: 'gray',
    fontSize: 18,
    borderBottomWidth: 2,
    borderColor: '#50adaa',
  },
});
