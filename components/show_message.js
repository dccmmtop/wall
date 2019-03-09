import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  CheckBox,
  ScrollView
} from "react-native";
import { Actions } from "react-native-router-flux";
import Request from "../lib/Request";
import Session from "../lib/Session";
import Api from "../lib/Api";
import Toast from "react-native-whc-toast";
import ModalDropdown from 'react-native-modal-dropdown';

export default class ShowMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentText: "",
      commentText: "",
      limitDays: "1000",
      isComment: true,
      likeCounts: 35,
      readCounts: "398",
      commentCounts: "50",
      nickname: '采蘑菇的小姑娘',
      published_at: "2019-03-01 10:23",
      liked: false,
      avatar: Api.root + "/uploads/loading.jpg"
    };
  }
  setText = text => {
    this.setState({
      commentText: text,
    });
  };
  dealLike = () =>{
    Session.getUser().then( user => {
      if(user){
        let url = ""
        if(this.state.liked){
          this.setState({liked: false, likeCounts: this.state.likeCounts - 1})
          url = Api.cancel_like
        }
        else{
          this.setState({liked: true, likeCounts: this.state.likeCounts + 1})
          url = Api.like
        }
        query = {
          token: user.token,
          message_id: this.props.messageId
        };
        Request.get({url: url, data: query}).then(res => {
          console.log("5757575757");
          console.log(res);
        }).catch(error => {
          console.log("61616");
          console.log(error);
        });

      }
      else{
        this.refs.toast.show("没有登录", Toast.Duration.long, Toast.Position.bottom);
      }
    }).catch(error => {
      console.log(error);
    });
  };

  componentDidMount = () => {
    console.log("==============");
    this.getMessage();
  };
  getMessage = () => {
    Session.getUser().then( user => {
      console.log("======token");
      console.log(user);
      query = {id: this.props.messageId, token: user ? user.token : "" };
      Request.get({url: Api.getMessageById, data: query}).then(res => {
        console.log(res);
        let result = res.result
        this.setState({
          avatar: Api.root + result.user.avatar,
          currentText: result.content,
          limitDays: result.limit_days,
          isComment: result.is_comment,
          likeCounts: result.like_counts,
          readCounts: result.read_counts,
          commentCounts: "50",
          nickname: result.user.nickname,
          published_at: result.published_at,
          liked: result.liked,
        });
      }).catch(error => {
        console.log(error);
      })
    }).catch(error => {
      console.log(error);
      // Actions.login({info: '请先登录'});
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
            style={styles.backBtn}
          >
            <Image
              style={styles.backImg}
              source={require("../icons/back.png")}
            />
          </TouchableOpacity>
          <Text style={[styles.text, styles.title]}>详情</Text>
        </View>
        <ScrollView>
          <View style={styles.mainGroup}>
            <View style={styles.messageInfo}>
              <View style={[styles.userAvatar]}>
                <Image style={{height:40,width: 40,borderRadius:50}} source={{uri: this.state.avatar}} />
              </View>

              <View style={[styles.infoRight,styles.flex1]}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.nicknameText,styles.flex1]}>{this.state.nickname}</Text>
                  <View style={[{alignItems:'flex-end',flex:1,marginRight:10}]}>
                    <ModalDropdown style={{alignItems: 'center',flexDirection:'row'}}
                      options={['编辑','删除']}
                      dropdownStyle={{width:90,height:72,justifyContent:'center',fontSize:13,color: 'red'}}
                      onSelect={(idx, value) => {
                        console.log(value);
                      }}
                    >
                      <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.nicknameText]}>操作</Text>
                        <Image style={{width:20,height:20}} source={require("../icons/drop-down.png")} />
                      </View>
                    </ModalDropdown>
                  </View>
                </View>
                <View style={[ styles.messageCount, styles.grayText ]}>
                  <Text style={[styles.grayText]}>{this.state.likeCounts} 喜欢 </Text>
                  <Text style={[styles.grayText]}>{this.state.readCounts} 阅读 </Text>
                  <Text style={[styles.grayText]}>{this.state.commentCounts} 评论 </Text>
                {/* <Text style={ this.state.liked ? styles.redText : styles.grayText}>喜欢</Text> */}
                </View>
              </View>
            </View>
            <View style={styles.content}>
              <Text> {this.state.currentText} </Text>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.flex1]}></Text>
              <View style={{flex:1,alignItems: "center",flexDirection:'column-reverse'}}>
                <TouchableOpacity onPress={() => {this.dealLike()}}>
                  <Image style={{height:30,width: 30}} source={ this.state.liked ? require("../icons/red_like.png") : require("../icons/like.png")} />
                </TouchableOpacity>
              </View>
              <View style= {{flex:1,flexDirection:'column-reverse',alignItems: "flex-end" }}>
                <Text style={styles.grayText}>{this.state.published_at}</Text>
              </View>
            </View>
          </View>


          <View style={[styles.commentGroup]}>
              <TextInput
                ref={input => {
                  this.textInput = input;
                }}
                value={this.state.text}
                style={[styles.adviceContent, styles.text]}
                placeholder="写下你的评论"
                multiline={true}
                numberOfLines={5}
                maxLength={50}
                underlineColorAndroid="transparent"
                value={this.state.commentText}
                onChangeText={text => { this.setText(text); }}
              />
            <View style={{flexDirection:'row-reverse'}}>
              <TouchableOpacity style={[styles.commentBtn]}>
                <Text style={styles.commentText}>发表</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.showCommentGroup]}>

            <View style={[styles.commentGroupHead]}>
              <Text style={styles.grayText}>评论({this.state.commentCounts})</Text>
            </View>
            <View style={[styles.commentGroupBody]}>
              <View style={[styles.commentGroupBodyLeft,styles.flex5]}>
                <Image style={{height:50,width: 50,borderRadius:50}} source={{uri: "https://upload.jianshu.io/users/upload_avatars/13198236/a6a4f353-186d-4df6-82a2-ec1847f5e56a.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240"}} />
              </View>
              <View style={[styles.commentGroupBodyRight,styles.flex1]}>
                <View style={[styles.commentGroupBodyTop]}>
                  <Text style={{fontSize: 16,fontWeight: 'bold', }}>卖报纸的小男孩</Text>
                </View>
                <View style={[styles.commentGroupBodyMedium]}>
                  <Text style={{fontSize: 14 }}>@ WindsOfDanzon想学习 python吗，对 python感兴趣？关于讲 python知识的不仅有课程还有详细的视频，零基础也可以学习 python,感兴趣欢迎关注微信公众号☞【编程之路从0到1】喜欢 python的朋友我们可以相互探讨，相互学习。</Text>
                </View>
                <View style={[styles.commentGroupBodyBottom]}>
                  <Text style={[styles.grayText]}> 2019-02-29 09:27 </Text>
                  {/* <TouchableOpacity onPress={() => {this.dealCommentLike()}}> */}
                  {/*   <Image style={{height:15,width: 15}} source={ this.state.liked ? require("../icons/red_like.png") : require("../icons/like.png")} /> */}
                  {/* </TouchableOpacity> */}
                </View>

              </View>

            </View>

          </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    marginBottom: 20,
  },
  back: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#f2f2f2",
    justifyContent: "center"
  },
  backBtn: {
    position: "absolute",
    left: 10
  },
  backImg: {
    width: 20,
    height: 20
  },
  title: {
    fontSize: 18
  },
  grayText: {
    fontSize: 12,
    color: "#969696"
  },
  redText: {
    fontSize: 12,
    color: "#d81e06"
  },
  mainGroup: {
    marginTop: 7,
    paddingLeft:10,
    paddingRight:10,
    paddingBottom:5,
    backgroundColor: "white",
  },

  content: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#ccc"
  },
  footer: {
    flexDirection: "row",
    height: 50,
  },
  like:{
    width:40,
    height:40
  },
  messageInfo: {
    textAlignVertical:'center',
    flexDirection: "row",
    height: 50,
    alignItems: "center",
  },
  messageCount:{
    flexDirection: "row",
    marginTop:5,
  },
  infoRight:{
    marginLeft: 8,
  },
  nickname:{
    fontSize: 14,
  },
  border:{
    borderWidth: 2,
    borderColor: "black"
  },
  commentGroup:{
    marginTop: 10,
    paddingLeft:10,
    backgroundColor: "white",
    paddingRight:10,
    paddingBottom: 10
  },
  commentBtn:{
    backgroundColor: "#50adaa",
    borderColor: "#4cae4c",
    borderRadius: 4,
    marginTop: 5,
    justifyContent: "center",
    alignItems: 'center',
    width: 80,
    height: 30,
  },
  commentText:{
    color: "white",
    fontSize: 14
  },

  adviceContent: {
    borderColor: "#c5c5c5",
    borderWidth: 1,
    height: 100,
    //从文本域顶部开始输入文字，而不是中间
    textAlignVertical: "top",
    padding: 10,
    marginTop: 10,
    backgroundColor: "white",
    borderRadius:5,
  },
  counterWrap: {
    flexDirection: "row-reverse",
    backgroundColor: "white",
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: "#c5c5c5",
    marginLeft: 10,
    marginRight: 10,
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
  },
  commentGroupHead:{
    height: 40,
    backgroundColor: "#F7F7F7",
    justifyContent: 'center',
    paddingLeft: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: "#dcdcdc"
  },
  commentGroupBody:{
    flexDirection: "row",
    backgroundColor:"white",
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop:5,
  },
  commentGroupBodyLeft:{
  },
  commentGroupBodyRight:{
    marginTop: 3,
    marginLeft:3,
  },
  commentGroupBodyBottom:{
    marginTop: 10,
    flexDirection: 'row',
    height: 25,
  },
  hint: {
    marginLeft: 10
  },
  counter: {
    marginRight: 10,
    marginBottom: 10
  },
  submit: {
    backgroundColor: "#50adaa",
    borderColor: "#4cae4c",
    borderRadius: 4,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20
  },
  submitText: {
    color: "white"
  },
  limitGroup:{
    flexDirection: "row",
    // borderColor: "red",
    // borderWidth: 1,
  },
  limitView: {
    flexDirection: "row",
    // borderColor: "#ccc",
    // borderWidth: 1,
    // marginLeft: 10,
    // marginRight: 10,
    marginTop: 20,
  },
  flex1:{
    flex: 1,
  },
  flex2:{
    flex: 2,
  },
  flex3:{
    flex: 3,
  },
  flex4:{
    flex: 4,
  },
  limitText: {
    height: 35,
    justifyContent: "center",
    alignItems: "flex-start",
    textAlign: 'right',
    textAlignVertical:'center',
  },
  limitInput: {
    // backgroundColor: "#50adaa",
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 0,
    textAlignVertical:'center',
    fontSize: 13,
    // marginRight: 10,
  },
});