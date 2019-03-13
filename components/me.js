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

export default class Me extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  showDialog() {
    this.setState({isDialogVisible: true});
  }

  hideDialog() {
    this.setState({isDialogVisible: false});
  }
  componentWillMount = () => {};
  componentDidMount = () => {
    Session.getUser()
      .then(user => {
        console.log(user);
        if (user) {
          this.setState({user: user});
        }
      })
      .catch(error => {});
  };
  render() {
    return (
      <View style={styles.container}>
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
              <Image
                style={{height: 90, width: 90, borderRadius: 50}}
                source={{uri: Api.root + this.state.user.avatar}}
              />
            </View>

            <View style={[styles.infoRight, styles.flex1]}>
              <Text
                style={[
                  styles.nicknameText,
                  {alignSelf: 'center', paddingTop: 5, paddingBottom: 5},
                ]}>
                {this.state.user.nickname}
              </Text>
              <Text style={[styles.grayText]}>{this.state.user.email} </Text>
            </View>
          </View>
        </View>

        <View style={styles.itemsGroup}>
          <View style={styles.items}>
            <View style={[styles.flex1, {justifyContent: 'center'}]}>
              <Text style={{fontSize: 17, alignItems: 'center'}}>我的留言</Text>
            </View>
            <View style={[styles.flex1, {justifyContent: 'center'}]}>
              <Image
                style={{width: 20, height: 20, alignSelf: 'flex-end'}}
                source={require('../icons/ico-right-arrow.png')}
              />
            </View>
          </View>

          <View style={styles.items}>
            <View style={[styles.flex1, {justifyContent: 'center'}]}>
              <Text style={{fontSize: 17, alignItems: 'center'}}>修改昵称</Text>
            </View>
            <View style={[styles.flex1, {justifyContent: 'center'}]}>
              <Image
                style={{width: 20, height: 20, alignSelf: 'flex-end'}}
                source={require('../icons/ico-right-arrow.png')}
              />
            </View>
          </View>

          <View style={styles.items}>
            <View style={[styles.flex1, {justifyContent: 'center'}]}>
              <Text style={{fontSize: 17, alignItems: 'center'}}>修改头像</Text>
            </View>
            <View style={[styles.flex1, {justifyContent: 'center'}]}>
              <Image
                style={{width: 20, height: 20, alignSelf: 'flex-end'}}
                source={require('../icons/ico-right-arrow.png')}
              />
            </View>
          </View>
          <View style={styles.items}>
            <View style={[styles.flex1, {justifyContent: 'center'}]}>
              <Text style={{fontSize: 17, alignItems: 'center'}}>修改密码</Text>
            </View>
            <View style={[styles.flex1, {justifyContent: 'center'}]}>
              <Image
                style={{width: 20, height: 20, alignSelf: 'flex-end'}}
                source={require('../icons/ico-right-arrow.png')}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 30,
            paddingLeft: 40,
            paddingRight: 40,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
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
    // backgroundColor: 'white',
    // borderRadius: 4,
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
});
