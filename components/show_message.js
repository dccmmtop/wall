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

export default class ShowMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentText: '',
      commentText: '',
      limitDays: '1000',
      isComment: true,
      likeCounts: 0,
      readCounts: '0',
      commentCounts: '0',
      nickname: '加载中...',
      published_at: '2019-03-01 10:23',
      liked: false,
      avatar: Api.root + '/uploads/loading.jpg',
      location: '',
      comments: [],
    };
    this.currentUser = null;
    this.page = 1;
    this.total = null;
    this.comments = {};
  }
  setText = text => {};
  dealLike = () => {
    Session.getUser()
      .then(user => {
        if (user) {
          let url = '';
          if (this.state.liked) {
            this.setState({
              liked: false,
              likeCounts: this.state.likeCounts - 1,
            });
            url = Api.cancel_like;
          } else {
            this.setState({liked: true, likeCounts: this.state.likeCounts + 1});
            url = Api.like;
          }
          query = {
            token: user.token,
            message_id: this.props.messageId,
          };
          Request.get({url: url, data: query})
            .then(res => {
              console.log('5757575757');
              console.log(res);
            })
            .catch(error => {
              console.log('61616');
              console.log(error);
            });
        } else {
          this.refs.toast.show(
            '没有登录',
            Toast.Duration.long,
            Toast.Position.bottom,
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    this.getMessage();
    Session.getUser().then(user => {
      this.currentUser = user;
      query = {
        token: user ? user.token : '',
        id: this.props.messageId,
        page: this.page,
      };
      Request.get({url: Api.getComments, data: query})
        .then(res => {
          this.total_pages = res.total_pages;
          this.setState({comments: res.comments});
        })
        .catch(error => {});
    });
    if (this.props.info)
      this.refs.toast.show(
        this.props.info,
        Toast.Duration.long,
        Toast.Position.bottom,
      );
    if (this.props.refresh) {
      Actions.refresh({info: '更新成功', messageId: this.props.messageId});
    }
  };

  componentWillReceiveProps = info => {
    if (info.refresh) {
      this.setState({isComment: info.isComment, currentText: info.currentText,limitDays: info.limitDays});
      this.refs.toast.show(
        "更新成功",
        Toast.Duration.long,
        Toast.Position.bottom,
      );
    }
  };
  getMessage = () => {
    Session.getUser()
      .then(user => {
        query = {id: this.props.messageId, token: user ? user.token : ''};
        Request.get({url: Api.getMessageById, data: query})
          .then(res => {
            let result = res.result;
            console.log('***********************8');
            console.log(res);
            this.setState({
              avatar: Api.root + result.user.avatar,
              currentText: result.content,
              limitDays: result.limit_days,
              isComment: result.is_comment,
              likeCounts: result.like_counts,
              readCounts: result.read_counts,
              commentCounts: result.comment_counts,
              nickname: result.user.nickname,
              published_at: result.published_at,
              liked: result.liked,
              location: result.location,
            });
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
        // Actions.login({info: '请先登录'});
      });
  };
  deleteMessage = () => {
    query = {
      token: this.currentUser.token,
      id: this.props.messageId,
    };
    Request.post({url: Api.deleteMessage, data: query})
      .then(res => {
        if (res.status == 0) Actions.mapInfo({info: '删除成功'});
        else Alert.alert('提醒', res.message);
      })
      .catch(error => {
        console.log(error);
      });
  };
  deal_option = value => {
    if (value == '编辑') {
      Actions.edit_message({
        message: {
          content: this.state.currentText,
          limitDays: this.state.limitDays,
          isComment: this.state.isComment,
          currentUser: this.currentUser,
          location: this.state.location,
          id: this.props.messageId,
        },
      });
    } else {
      Alert.alert('删除', '确认删除此篇文章吗？', [
        {text: '取消', onPress: () => {}},
        {text: '确认', onPress: this.deleteMessage},
      ]);
    }
  };
  dealCommentLike = commentId => {
    if (!this.currentUser) {
      this.refs.toast.show(
        '没有登录',
        Toast.Duration.long,
        Toast.Position.bottom,
      );
      return;
    }
    let comments = this.state.comments;
    comments[commentId].liked = !comments[commentId].liked;
    this.setState({comments: comments});
    let url = null;
    if (comments[commentId].liked) {
      url = Api.commentLike;
    } else {
      url = Api.cancelCommentLike;
    }
    query = {
      token: this.currentUser.token,
      comment_id: commentId.replace('id-', ''),
    };
    Request.get({url: url, data: query})
      .then(res => {
        console.log(res);
        if (res.status != 0) {
          comments[commentId].liked = !comments[commentId].liked;
          this.setState({comments: comments});
          this.refs.toast.show(
            '操作失败',
            Toast.Duration.long,
            Toast.Position.bottom,
          );
        }
      })
      .catch(error => {
        Alert.alert('提醒', error);
      });
  };
  loadMoreData = () => {
    this.page += 1;
    if (this.page <= this.total_pages) {
      user = this.currentUser;
      query = {
        token: user ? user.token : '',
        id: this.props.messageId,
        page: this.page,
      };
      Request.get({url: Api.getComments, data: query})
        .then(res => {
          console.log(res);
          this.total_pages = res.total_pages;
          this.setState({
            comments: Object.assign(this.state.comments, res.comments),
          });
        })
        .catch(error => {});
    } else {
    }
  };
  createComment = () => {
    commentTextLength = this.state.commentText.trim().length;
    if (commentTextLength == 0) {
      Alert.alert('提醒', '评论不能为空');
      return;
    }
    if (commentTextLength > 200) {
      Alert.alert('提醒', '评论不能超过两百字');
      return;
    }
    if (this.currentUser) {
      query = {
        token: this.currentUser.token,
        content: this.state.commentText,
        message_id: this.props.messageId,
      };
      Request.post({url: Api.createComment, data: query})
        .then(res => {
          if (res.status == 0) {
            console.log(res);
            this.setState({
              comments: Object.assign(res.comment, this.state.comments),
              commentText: '',
              commentCounts: this.state.commentCounts + 1,
            });
          } else {
            Alert.alert('提醒', res.message.replace(/[a-zA-Z]/g, ''));
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Actions.login({info: '请先登录'});
    }
  };
  renderFooter = () => {
    if (this.page + 1 <= this.total_pages) {
      return (
        <View style={styles.comentFooter}>
          <TouchableOpacity
            onPress={this.loadMoreData}
            style={styles.loadMoreBtn}>
            <Text style={styles.grayText}> ——查看更多评论—— </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.comentFooter}>
          <TouchableOpacity style={styles.loadMoreBtn}>
            <Text style={styles.grayText}> ——end—— </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  showTrash = (commendId, commentUserNickname) => {
    let trash = (
      <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 10}}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('删除', '确认删除评论吗？', [
              {text: '取消', onPress: () => {}},
              {
                text: '确认',
                onPress: () => {
                  this.deleteComment(commendId);
                },
              },
            ]);
          }}>
          <Image
            style={{height: 15, width: 15}}
            source={require('../icons/trash.png')}
          />
        </TouchableOpacity>
      </View>
    );
    if (this.currentUser && this.state.nickname == this.currentUser.nickname) {
      return trash;
    }
    if (this.currentUser && commentUserNickname == this.currentUser.nickname) {
      return trash;
    }
  };

  deleteComment = commentId => {
    query = {
      id: commentId,
      token: this.currentUser ? this.currentUser.token : '',
    };
    Request.post({url: Api.deleteComment, data: query})
      .then(res => {
        if (res.status == 0) {
          comments = this.state.comments;
          delete comments['id-' + commentId];
          console.log('=================');
          console.log(comments);
          this.setState({
            comments: comments,
            commentCounts: this.state.commentCounts - 1,
          });
        }
      })
      .catch(error => {});
  };
  listItem = () => {
    return (
      <View style={[styles.recordList]}>
        <FlatList
          data={Object.values(this.state.comments)}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(item, index) => {
            return item.id + item.liked.toString();
          }}
          renderItem={({item}) => (
            <View style={[styles.commentGroupBody]}>
              <View style={[styles.commentGroupBodyLeft, styles.flex5]}>
                <Image
                  style={{height: 50, width: 50, borderRadius: 50}}
                  source={{
                    uri: Api.root + item.user.avatar,
                  }}
                />
              </View>
              <View style={[styles.commentGroupBodyRight, styles.flex1]}>
                <View style={[styles.commentGroupBodyTop]}>
                  <Text style={{fontSize: 16, fontWeight: 'bold', flex: 1}}>
                    {item.user.nickname}
                  </Text>
                  {this.showTrash(
                    item.id.replace('id-', ''),
                    item.user.nickname,
                  )}
                </View>
                <View style={[styles.commentGroupBodyMedium]}>
                  <Text style={{fontSize: 14}}>{item.content}</Text>
                </View>
                <View style={[styles.commentGroupBodyBottom]}>
                  <Text style={[styles.grayText, styles.flex1]}>
                    {item.published_at}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.dealCommentLike(item.id);
                    }}
                    style={{
                      alignItems: 'flex-end',
                      flex: 1,
                      paddingRight: 10,
                    }}>
                    <Image
                      style={{height: 15, width: 15}}
                      source={
                        this.state.comments[item.id].liked
                          ? require('../icons/red_like.png')
                          : require('../icons/like.png')
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  };
  commentsHintText = () => {
    if (this.currentUser) {
      if (this.state.isComment) {
        return '写下你的评论';
      } else {
        return '作者已关闭评论';
      }
    } else {
      return '登录后方可评论';
    }
  };
  render() {
    let optional = null;
    if (this.currentUser && this.currentUser.nickname == this.state.nickname) {
      optional = (
        <View style={[{alignItems: 'flex-end', flex: 1, marginRight: 10}]}>
          <ModalDropdown
            style={{alignItems: 'center', flexDirection: 'row'}}
            options={['编辑', '删除']}
            dropdownStyle={{
              width: 90,
              height: 72,
              justifyContent: 'center',
              fontSize: 13,
            }}
            onSelect={(idx, value) => {
              this.deal_option(value);
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.nicknameText]}>操作</Text>
              <Image
                style={{width: 20, height: 20}}
                source={require('../icons/drop-down.png')}
              />
            </View>
          </ModalDropdown>
        </View>
      );
    }

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
          <Text style={[styles.text, styles.title]}>详情</Text>
        </View>
        <ScrollView>
          <View style={styles.mainGroup}>
            <View style={styles.messageInfo}>
              <View style={[styles.userAvatar]}>
                <Image
                  style={{height: 40, width: 40, borderRadius: 50}}
                  source={{uri: this.state.avatar}}
                />
              </View>

              <View style={[styles.infoRight, styles.flex1]}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.nicknameText, styles.flex1]}>
                    {this.state.nickname}
                  </Text>
                  {optional}
                </View>
                <View style={[styles.messageCount, styles.grayText]}>
                  <Text style={[styles.grayText]}>
                    {this.state.likeCounts} 喜欢{' '}
                  </Text>
                  <Text style={[styles.grayText]}>
                    {this.state.readCounts} 阅读{' '}
                  </Text>
                  <Text style={[styles.grayText]}>
                    {this.state.commentCounts} 评论{' '}
                  </Text>
                  {/* <Text style={ this.state.liked ? styles.redText : styles.grayText}>喜欢</Text> */}
                </View>
              </View>
            </View>
            <View style={styles.content}>
              <Text> {this.state.currentText} </Text>
            </View>

            <View style={styles.footer}>
              <Image
                style={{height: 20, width: 20, alignSelf: 'flex-end'}}
                source={require('../icons/location_1.png')}
              />
              <Text style={[styles.grayText, {alignSelf: 'flex-end'}]}>
                {' '}
                {this.state.location}{' '}
              </Text>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'column-reverse',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.dealLike();
                  }}>
                  <Image
                    style={{height: 30, width: 30}}
                    source={
                      this.state.liked
                        ? require('../icons/red_like.png')
                        : require('../icons/like.png')
                    }
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column-reverse',
                  alignItems: 'flex-end',
                }}>
                <Text style={styles.grayText}>{this.state.published_at}</Text>
              </View>
            </View>
          </View>

          <View
            style={[styles.commentGroup]}
            pointerEvents={
              this.state.isComment && this.currentUser != null ? 'auto' : 'none'
            }>
            <TextInput
              ref={input => {
                this.textInput = input;
              }}
              value={this.state.text}
              style={[styles.adviceContent, styles.text]}
              placeholder={this.commentsHintText()}
              multiline={true}
              numberOfLines={5}
              maxLength={50}
              underlineColorAndroid="transparent"
              value={this.state.commentText}
              onChangeText={text => {
                this.setState({
                  commentText: text,
                });
              }}
            />
            <View style={{flexDirection: 'row-reverse'}}>
              <TouchableOpacity
                disabled={!this.state.isComment}
                style={[styles.commentBtn]}
                onPress={() => this.createComment()}>
                <Text style={styles.commentText}>发表</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.showCommentGroup]}>
            <View style={[styles.commentGroupHead]}>
              <Text style={styles.grayText}>
                评论({this.state.commentCounts})
              </Text>
            </View>
            {this.listItem()}
          </View>
        </ScrollView>
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
