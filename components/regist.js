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
    this.state = { nickname: "", password: "",validate_code: "", password_confirmation: "", email: "", validate_code_btn_text: "获取验证码"};
    this.count = 120;
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
    setInterval( () => {
      this.count --;
      if(this.count <= 0){
        this.setState({validate_code_btn_text: "获取验证码"});
      }
      else{
        this.setState({validate_code_btn_text: "重新获取验证码" + "(" + this.count + ")"});
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
        this.refs.toast.show("验证码已发送", Toast.Duration.short, Toast.Position.bottom);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  validateLogin = () => {
    console.log("enter validate");
    //验证用户名或者密码是否为空
    if (
      this.state.userName.trim().length == 0 ||
      this.state.password.trim().length == 0
    ) {
      alert("账号或密码不能为空!");
      return false;
    }
    //是否包含有特殊字符
    else {
      let pattern = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
      );
      if (
        pattern.test(this.state.userName) ||
        pattern.test(this.state.password)
      ) {
        alert("账号或密码不能包含特殊字符!");
        return false;
      }
    }
    return true;
  };

  _onClickLogin = () => {
    console.log("onClickLogin");
    //是否能通过验证
    if (this.validateLogin()) {
      new Session(this.state.userName, this.state.password)
        .setSession()
        .then(() => {
          this.hideInputBox();
          //弹出堆栈，直到 到达mapInfo
          Actions.popTo("mapInfo");
          Actions.refresh({ jumpData: "登录成功" });
        })
        .catch(error => {
          alert(error);
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
            />
            <TouchableOpacity
              style={styles.verifiBtn}
              enabled= {this.count < 120 ? false : true}
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
              selectTextOnFocus={true}
              maxLength={16}
            />
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              // this._onClickLogin();
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
