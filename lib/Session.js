import storage from "./Storage";

export default class Session {
  // constructor(account, password) {
  //   this.account = account;
  //   this.password = password;
  //   this.logintime = dateformat(new Date(), "yyyy-mm-dd HH:MM");
  //   this.loginUrl = Api.sessionUrl;
  //   token = "";
  // }


  setSession = () => {
    return new Promise((resolve, reject) => {
      this.sendLoginRequest()
        .then(data => {
          //获得个人的 总积分==（token）
          CheckIn.setScore(data.token);
          storage.save({
            key: "session",
            id: "session",
            data: Object.assign(data, {
              account: this.account,
              password: this.password
            }),
            expires: null
          });
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  static getSession = () => {
    return storage.load({
      key: "session",
      id: "session"
    });
  };

  static logout = () => {
    storage.clearMap();
    return storage.remove({
      key: "session",
      id: "session"
    });
  };



  static login = (token, nickname,email) => {
    storage.save({
      key: "session",
      id: "token",
      data: {
        nickname: nickname,
        token: token,
        email: email
      },
      expires: null
    });
  };

  static getUser = () => {
    return storage.load({
      key: "session",
      id: "token"
    });
  }
}
