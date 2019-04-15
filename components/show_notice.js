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
import {Actions, Scene, Router, Stack} from 'react-native-router-flux';
import Request from '../lib/Request';
import Session from '../lib/Session';
import Api from '../lib/Api';
import Toast from 'react-native-whc-toast';
import ModalDropdown from 'react-native-modal-dropdown';

export default class ShowNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      created_at: '',
      currentText: '',
      limitDays: '',
      isComment: true,
      currentUser: null,
      location: '',
      messageId: '',
    };
  }

  componentDidMount = () => {
    this.get_notice();
  };

  get_notice = () => {
    Session.getUser().then(user => {
      query = {
        token: user.token,
        id: this.props.id,
      };
      Request.get({url: Api.getNotice, data: query})
        .then(res => {
          console.log(res);
          this.setState({
            messageId: res.message_id,
            content: res.content,
            created_at: res.created_at,
            currentUser: user,
            currentText: res.current_text,
            limitDays: res.limit_days,
            isComment: res.is_comment,
            location: res.location,
          });
        })
        .catch(error => {});
    });
  };

  go_to_edit_message = () => {
    if (this.state.messageId) {
      return (
        <View
          style={{
            paddingLeft: 30,
            paddingRight: 30,
            marginBottom: 40,
            marginTop: 10,
            flexDirection: 'column-reverse',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Actions.edit_message({
                message: {
                  content: this.state.currentText,
                  limitDays: this.state.limitDays,
                  isComment: this.state.isComment,
                  currentUser: this.state.currentUser,
                  location: this.state.location,
                  id: this.state.messageId,
                },
              });
            }}
            style={{
              backgroundColor: '#42b0ae',
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
              前去修改
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
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
          <Text style={[styles.text, styles.title]}>消息</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 5,
            padding: 10,
            flex: 6,
          }}>
          <Text
            style={{
              fontSize: 18,
            }}>
            内容：
          </Text>
          <Text
            style={{
              marginTop: 10,
              paddingLeft: 10,
            }}>
            {this.state.content}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#969696',
              paddingLeft: 10,
            }}>
            {this.state.created_at}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
          }}>
          {this.go_to_edit_message()}
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
    fontSize: 12,
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
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  messageCount: {
    flexDirection: 'row',
    marginTop: 5,
  },
  infoRight: {
    marginLeft: 8,
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
});
