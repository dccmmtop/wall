import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  CheckBox
} from "react-native";
import { Actions } from "react-native-router-flux";
import Request from "../lib/Request";
import Session from "../lib/Session";
import Api from "../lib/Api";

export default class NewMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentText: "中华人民共和国中央人民政府",
      limitDays: "",
      isComment: true,
    };
  }
  setText = text => {
    this.setState({
      currentText: text
    });
  };

  componentDidMount = () => {
    console.log("==============");
    console.log( JSON.stringify(this.props.position));
  };
  newMessage = () => {
    Session.getUser().then( user => {
      console.log("======token");
      console.log(user);
      query = {
        latitude: this.props.position.latitude,
        longitude: this.props.position.longitude,
        location: this.props.position.poiName,
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
          <Text style={[styles.text, styles.title]}>留言</Text>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            ref={input => {
              this.textInput = input;
            }}
            value={this.state.text}
            style={[styles.adviceContent, styles.text]}
            placeholder="此刻的心情"
            multiline={true}
            numberOfLines={9}
            maxLength={200}
            //取消输入时下划线光标
            underlineColorAndroid="transparent"
            value={this.state.currentText}
            onChangeText={text => {
              this.setText(text);
          }}
    />
    <View style={styles.counterWrap}>
      <Text style={styles.counter}>
        {this.state.currentText.length}/200
      </Text>
    </View>
  </View>

  <View style={styles.limitView} >
    <View style={[ styles.limitGroup , styles.flex1]} >
      <Text style={[styles.limitText,styles.flex1]}>有效期(天)：</Text>
      <TextInput
        ref="limitInput"
        style={[styles.limitInput,styles.flex1]}
        placeholderTextColor="gray"
        underlineColorAndroid="transparent"
        onChangeText={text => {
          this.setState({ limitDays: text.toString() });
        }}
        keyboardType='numeric'
        value={this.state.limitDays}
        placeholder="默认永不过期"
      />
    </View>
    <View style={[ styles.limitGroup , styles.flex1]} >
      <Text style={[styles.limitText,styles.flex1]}>允许评论</Text>
      <CheckBox
        style={[ styles.limitGroup , styles.flex1]}
        iconType='material'
        checkedIcon='clear'
        uncheckedIcon='add'
        checkedColor='red'
        value={this.state.isComment}
        onValueChange={() => { 
          this.setState({isComment: !this.state.isComment})
        }}
      />
    </View>
  </View>
    <View style={[ styles.limitGroup,{marginTop:10}]} >
      <Image style={{ marginLeft: 20,width:30,height: 30 }} source={require("../icons/location_info.png")} />
      <Text style={{marginLeft: 10,marginTop: 10}}>{this.props.position.poiName}</Text>
    </View>

  <View>
    <TouchableOpacity
      style={styles.submit}
      onPress={() => {
        this.newMessage();
      }}
    >
      <Text style={[styles.submitText, styles.text]}>发表</Text>
    </TouchableOpacity>
  </View>
</View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2"
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
  text: {
    fontSize: 16
  },
  inputGroup: {
    marginTop: 10,
  },
  adviceContent: {
    borderColor: "#c5c5c5",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    height: 250,
    //从文本域顶部开始输入文字，而不是中间
    textAlignVertical: "top",
    padding: 10,
    marginTop: 10,
    backgroundColor: "white",
    marginLeft: 10,
    marginRight: 10,
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
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
