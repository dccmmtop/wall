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
import Toast from "react-native-whc-toast";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { nickname: "邓超",
      password: "1234567",
      validate_code: "",
      password_confirmation: "1234567",
      email: "dccmmtop@foxmail.com",
      validate_code_btn_text: "获取验证码",
      validate_code_btn_disabled: false};
    this.count = 5;
  }

  getuserName = () => {
    return this.state.nickname;
  };

  validate_on_get_validate_code = () => {
    if(this.state.nickname.trim().length == 0){
      alert("昵称不能为空");
      return false;
    }
    if(this.state.email.trim().length == 0){
      alert("邮箱不能为空");
      return false;
    }
    return true;
  };

  getRequest = (url, query) => {
    if (query) {
    } else {
      query = {};
    }
    return fetch(url, {
      method: "GET",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json"
      }
    });
  };
  start_interval = () =>{
    let intervalID = setInterval( () => {
      this.count --;
      if(this.count <= 0){
        clearInterval(intervalID);
        this.setState({validate_code_btn_text: "获取验证码",validate_code_btn_disabled: false});
      }
      else{
        this.setState({validate_code_btn_text: "重新获取验证码" + "(" + this.count + ")",validate_code_btn_disabled: true});
      }
    },1000);
  }
  get_validate_code = () => {
    if(this.validate_on_get_validate_code()){
      // TODO 请求API
      query = {email: this.state.email}
      Request.get({url: Api.validate_code_url, data: query}).then( res => {
        console.log(res);
        this.count = 120;
        this.start_interval();
        this.setState({validate_code: res.message})
        this.refs.toast.show("验证码已发送", Toast.Duration.short, Toast.Position.bottom);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  validateRegist = () => {
    console.log("enter validate");
    if(this.validate_on_get_validate_code() == false)
      return false;
    if(this.state.validate_code.trim().length == 0){
      alert("验证码不能为空");
      return false;
    }
    if(this.state.password.trim().length == 0){
      alert("密码不能为空");
      return false;
    }
    if(this.state.password_confirmation.trim().length == 0){
      alert("重复密码不能为空");
      return false;
    }
    if(this.state.password_confirmation.trim() != this.state.password.trim()){
      alert("密码不一致");
      return false;
    }
    return true;
  };

  _onClickRegist = () => {
    console.log("onClickLogin");
    //是否能通过验证
    if (this.validateRegist()) {
      query = {
        email: this.state.email.trim(),
        name: this.state.nickname.trim(),
        validate_code: this.state.validate_code.trim(),
        password: this.state.password.trim(),
        password_confirmation: this.state.password_confirmation.trim()
      };
      Request.post({url: Api.regist_url, data: query}).then(res => {
        if(res.status != 0){
          alert(res.message.replace(/[a-zA-Z]/g,""));
        }else{
          this.refs.toast.show("注册成功,跳转到登录界面", Toast.Duration.long, Toast.Position.bottom);
          setTimeout( Actions.login,2000)
        }
        console.log(res);
      }).catch(error => {
        console.log(error);
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
              ref="nickname"
              style={[styles.inputContent]}
              placeholder="昵称"
              placeholderTextColor="gray"
              underlineColorAndroid="transparent"
              onFocus={() => this.refs.toast.close(true)}
              onChangeText={text => {
                this.setState({ nickname: text });
              }}
              selectTextOnFocus={true}
              maxLength={16}
              value={this.state.nickname}
            />
          </View>
          <View style={styles.inputGroup}>
            <Image
              style={[styles.inputLabel]}
              source={require("../icons/email.png")}
            />
            <TextInput
              ref="email"
              style={[styles.inputContent]}
              placeholder="邮箱"
              placeholderTextColor="gray"
              underlineColorAndroid="transparent"
              onFocus={() => this.refs.toast.close(true)}
              onChangeText={text => {
                this.setState({ email: text });
              }}
              selectTextOnFocus={true}
              value={this.state.email}
            />
          </View>
          <View style={styles.inputGroup}>
            <Image
              style={[styles.inputLabel]}
              source={require("../icons/verifi.png")}
            />
            <TextInput
              ref="validate_code"
              style={[styles.inputContent]}
              placeholder="验证码"
              placeholderTextColor="gray"
              underlineColorAndroid="transparent"
              onFocus={() => this.refs.toast.close(true)}
              onChangeText={text => {
                this.setState({ validate_code: text });
              }}
              selectTextOnFocus={true}
              maxLength={16}
              value={this.state.validate_code}
            />
            <TouchableOpacity
              style={this.state.validate_code_btn_disabled ? styles.verifiBtnDis : styles.verifiBtn}
              disabled= {this.state.validate_code_btn_disabled}
              onPress={() => {
                this.get_validate_code();
              }} >
              <Text style={styles.verifiText}>{this.state.validate_code_btn_text}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputGroup, { borderTopWidth: 0 }]}>
            <Image
              style={[styles.inputLabel]}
              source={require("../icons/password.png")}
            />
            <TextInput
              ref="password"
              style={[styles.inputContent]}
              placeholder="密码"
              placeholderTextColor="gray"
              underlineColorAndroid="transparent"
              onFocus={() => this.refs.toast.close(true)}
              onChangeText={text => {
                this.setState({ password: text });
              }}
              value={this.state.password}
              secureTextEntry
              selectTextOnFocus={true}
              maxLength={16}
            />
          </View>
          <View style={[styles.inputGroup, { borderTopWidth: 0 }]}>
            <Image
              style={[styles.inputLabel]}
              source={require("../icons/password.png")}
            />
            <TextInput
              ref="password_confirmation"
              style={[styles.inputContent]}
              placeholder="重复密码"
              placeholderTextColor="gray"
              underlineColorAndroid="transparent"
              onFocus={() => this.refs.toast.close(true)}
              onChangeText={text => {
                this.setState({ password_confirmation: text });
              }}
              secureTextEntry
              value={this.state.password_confirmation}
              selectTextOnFocus={true}
              maxLength={16}
            />
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              this._onClickRegist();
            }}
          >
            <Text style={styles.loginText}>注 册</Text>
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
  verifiBtn: {
    marginTop: 20,
    marginLeft: 40,
    // marginRight: 30,
    backgroundColor: "#42b0ae",
    justifyContent: "center",
    height: 28
  },
  verifiBtnDis: {
    marginTop: 20,
    marginLeft: 40,
    // marginRight: 30,
    backgroundColor: "#ccc",
    justifyContent: "center",
    height: 28
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
  verifiText: {
    fontSize: 15,
    textAlign: "right",
    color: "white",
    marginRight: 5,
    marginLeft: 5,
    marginTop: 0
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
  verifiInputGroup: {
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
