import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image
} from "react-native";
import { Actions } from "react-native-router-flux";
import Api from "../lib/Api";
import Request from "../lib/Request";
import Session from "../lib/Session";
import Toast from "react-native-whc-toast";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { nickname: "dccmmtop@foxmail.com", password: "1234567" };
  }

  getuserName = () => {
    return this.state.userName;
  };


  componentDidMount = () => {
    if (this.props.info) {
      this.refs.toast.show( this.props.info, Toast.Duration.short, Toast.Position.bottom);
    }
  };

  validateLogin = () => {
    console.log("enter validate");
    if(this.state.nickname.length == 0){
      alert("邮箱或昵称不能为空");
      return false;
    }
    if(this.state.password.length == 0){
      alert("密码不能为空");
      return false;
    }
    return true;
  };

  _onClickLogin = () => {
    console.log("onClickLogin");
    //是否能通过验证
    if (this.validateLogin()) {
      query = {
        email_name: this.state.nickname,
        password: this.state.password
      };
      Request.post({url: Api.login_url, data: query}).then(res => {
        console.log(res);
        if(res.status != 0){
          alert(res.message);
        }else{
          Session.login(res.token,res.nickname,res.email,res.avatar)
          this.refs.toast.show("登录成功", Toast.Duration.long, Toast.Position.bottom);
          setTimeout( Actions.mapInfo,1500)
        }
      }).catch(error => {
      });
    }
  };

  hideInputBox = () => {
    // this.refs.inputLogin.blur();
    // this.refs.inputPassword.blur();
  };
  // componentDidMount = () => {
  //   if (this.props.jumpData) {
  //     this.refs.toast.show(
  //       this.props.jumpData,
  //       Toast.Duration.short,
  //       Toast.Position.bottom
  //     );
  //   }
  // };

  render() {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => {
          this.hideInputBox();
        }}
      >
        <View style={styles.container}>
          <Toast ref="toast" />

          <View style={[styles.logoWrap]}>
            <Text style={styles.title}>Message</Text>
          </View>
          <View style={styles.inputGroup}>
            <Image
              style={[styles.inputLabel]}
              source={require("../icons/user.png")}
            />
            <TextInput
              ref="inputLogin"
              style={[styles.inputContent]}
              placeholder="账号"
              placeholderTextColor="gray"
              underlineColorAndroid="transparent"
              onFocus={() => this.refs.toast.close(true)}
              onChangeText={text => {
                this.setState({ nickname: text });
              }}
              selectTextOnFocus={true}
              value={this.state.nickname}
            />
          </View>
          <View style={[styles.inputGroup, { borderTopWidth: 0 }]}>
            <Image
              style={[styles.inputLabel]}
              source={require("../icons/password.png")}
            />
            <TextInput
              ref="inputPassword"
              style={[styles.inputContent]}
              placeholder="密码"
              placeholderTextColor="gray"
              underlineColorAndroid="transparent"
              onFocus={() => this.refs.toast.close(true)}
              onChangeText={text => {
                this.setState({ password: text });
              }}
              secureTextEntry
              selectTextOnFocus={true}
              maxLength={16}
              value={this.state.password}
            />
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              this._onClickLogin();
            }}
          >
            <Text style={styles.loginText}>登 录</Text>
          </TouchableOpacity>
          <TouchableOpacity
            //style={styles.loginBtn}
      onPress={() => {
        // this._onClickLogin();
        Actions.regist();
      }}
    >
      <Text style={styles.registText}>注册新账号>></Text>
    </TouchableOpacity>
  </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center'
  },
  title: {
    fontSize: 35,
    alignSelf: "center",
    color: "#42b0ae",
    marginBottom: 60
  },
  flex: {
    flex: 1
  },
  loginBtn: {
    marginTop: 50,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: "#42b0ae",
    justifyContent: "center",
    height: 50
  },
  loginText: {
    fontSize: 18,
    textAlign: "center",
    color: "white"
  },
  registText: {
    fontSize: 15,
    textAlign: "right",
    color: "#42b0ae",
    marginRight: 30,
    marginTop: 15
  },
  inputGroup: {
    alignSelf: "stretch",
    flexDirection: "row",
    height: 55,
    marginLeft: 30,
    marginRight: 30,
    borderBottomWidth: 1,
    borderColor: "gray"
  },
  inputLabel: {
    marginTop: 15,
    marginRight: 10,
    marginLeft: 10,
    width: 25,
    height: 25
  },
  inputContent: {
    color: "gray",
    flex: 1,
    fontSize: 18
  }
});
