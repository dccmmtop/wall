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

export default class ShowMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentText: " 11. Buka\
电子书管理。开源、免费。\
https://github.com/oguzhaninan/Buka/releases\
★ star：578\n\
\n10. Calibre\
难以置信的丑但很强大的电子书管理和转换软件。开源、免费。\
https://calibre-ebook.com/\
\n9. Evince\
Evince 是一款支持多种格式的文档查看器。Evince 的目标是用一个简单的应用取代已经存在于 GNOME 桌面的多种文档查看器。开源、免费。\
https://wiki.gnome.org/Apps/Evince\
\n8. FBReader\
最流行的电子阅读应用之一。免费。\
https://fbreader.org/content/fbreader-beta-linux-desktop\
\n7. Foxit\
Foxit Reader 8.0——获得殊荣的 PDF 阅读器。免费。\
https://www.foxitsoftware.com/pdf-reader/\
\n6. Lucidor\
Lucidor 是一个阅读和处理电子书的电脑软件。Lucidor 支持 EPUB 格式的电子书和 OPDS 格式的目录。免费。\
http://www.lucidor.org/lucidor/\
\n5. MasterPDF editor\
Master PDF Editor 一款方便而智能的 Linux PDF 编辑器。免费。\
https://code-industry.net/free-pdf-editor/\
\n4. MuPDF\
一款轻量级的 PDF 和 XPS 查看器。开源、免费。\
https://mupdf.com/\
\n3. Okular\
Okular 由 KDE 原始开发的通用文档查看器。Okular 可以在多个平台上工作，包括但不限于 Linux，Windows，Mac OS X，BSD 等等。免费。\
https://okular.kde.org/\
\n2. qpdf\
qpdfview 是一款标签页式文档查看器。开源、免费。\
https://launchpad.net/qpdfview\
\n1. Sigil\
Sigil 是一款多平台 EPUB 电子书编辑器。开源、免费。\
https://github.com/Sigil-Ebook/Sigil\
      ",
      commentText: "",
      limitDays: "1000",
      isComment: true,
      likeCounts: 35,
      readCounts: "398",
      commentCounts: "50",
      nickname: '采蘑菇的小姑娘',
      published_at: "2019-03-01 10:23",
      liked: true
    };
  }
  setText = text => {
    this.setState({
      commentText: text,
    });
  };
  dealLike = () =>{
    if(this.state.liked)
      this.setState({liked: false, likeCounts: this.state.likeCounts - 1})
    else
      this.setState({liked: true, likeCounts: this.state.likeCounts + 1})
  };
  componentDidMount = () => {
    console.log("==============");
  };
  newMessage = () => {
    Session.getUser().then( user => {
      console.log("======token");
      console.log(user);
      query = {
        latitude: this.props.position.latitude,
        longitude: this.props.position.longitude,
        limit_days: this.state.limitDays,
        limit_user_accounts: 100000000,
        content: this.state.currentText,
        token: user.token,
        is_comment: this.state.isComment
      };
      Request.post({url: Api.newMessagUrl, data: query}).then(res => {

        console.log(res.message);
        if(res.status == 200){
          Actions.login({info: '请先登录'});
        }else if(res.status == 0){
          Actions.mapInfo({info: '留言成功'});
        }else{
          alert(res.message.replace(/[a-zA-Z]/g,""));
        }
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
                <Image style={{height:40,width: 40,borderRadius:50}} source={require("../icons/test_user.jpg")} />
              </View>

              <View style={[styles.infoRight]}>
                <Text style={[styles.nicknameText]}>{this.state.nickname}</Text>
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
    marginLeft: 8
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
