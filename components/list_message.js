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
import ModalDropdown from 'react-native-modal-dropdown';
import {Bars} from 'react-native-loader';

export default class ListMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loading: true,
    };
    this.currentUser = null;
    this.page = 1;
    this.total = null;
  }
  componentDidMount = () => {
    this.getMessages(1);
  };

  componentWillReceiveProps = info => {
    let tampMessages = []
    for(let i in this.state.messages){
      if(this.state.messages[i].id != info.deleteMessageId){
        tampMessages.push(this.state.messages[i])
      }
    }
    this.setState({messages: tampMessages})
  }

  getMessages = page => {
    Session.getUser().then(user => {
      this.currentUser = user;
      query = {
        token: user.token,
        page: page,
      };
      Request.get({url: Api.getMessageByUser, data: query})
        .then(res => {
          console.log(res);
          this.total_pages = res.total_pages;
          this.setState({
            loading: false,
            messages: this.state.messages.concat(res.result),
          });
        })
        .catch(error => {
          this.setState({
            loading: false,
          });
        });
    });
  };

  loadMoreData = () => {
    this.page += 1;
    this.getMessages(this.page);
  };
  renderFooter = () => {
    if (this.page + 1 <= this.total_pages) {
      return (
        <View style={styles.comentFooter}>
          <TouchableOpacity
            onPress={this.loadMoreData}
            style={styles.loadMoreBtn}>
            <Text style={styles.grayText}> ——更多数据—— </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.comentFooter}>
          <TouchableOpacity style={styles.loadMoreBtn}>
            <Text style={styles.grayText}> ——我是有底线的—— </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  renderEmpty = () => {
    if (this.state.loading == false) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../icons/empty.png')}
            style={{width: 190, height: 150}}
          />
          <Text style={styles.grayText}>没有留言</Text>
        </View>
      );
    }
  };

  showMessage = messageId => {
    Actions.show_message({messageId: messageId,parent: 'list_message'});
  };

  listItem = () => {
    return (
      <View style={[styles.recordList]}>
        <FlatList
          data={this.state.messages}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(item, index) => {
            return item.published_at;
          }}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.showMessage(item.id);
              }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#dcdcdc',
                  padding: 10,
                  backgroundColor: 'white',
                }}>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                  <Text style={{fontSize: 16}}>{item.content}</Text>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      flex: 1,
                    }}>
                    <Text style={styles.grayText}>
                      喜欢({item.like_counts})
                    </Text>
                    <Text style={styles.grayText}>
                      评论({item.comment_counts})
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.grayText]}>{item.location}</Text>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      flex: 1,
                    }}>
                    <Text style={styles.grayText}>{item.published_at}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  loading = () => {
    if (this.state.loading) {
      return (
        <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
          <Bars size={20} color="#50adaa" />
        </View>
      );
    }
  };
  render() {
    const messages =
      this.state.messages.length > 0 ? this.listItem() : this.renderEmpty();
    return (
      <View style={styles.container}>
        <Toast ref="toast" />
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
          <Text style={[styles.text, styles.title]}>所有留言</Text>
        </View>
        {this.loading()}
        {messages}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
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
  recordList: {
    marginTop: 10,
  },
});
