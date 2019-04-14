export default class Api {
  // static base_url = "http://192.168.1.101:3000/api";
  // static root = "http://192.168.1.101:3000";
  // static base_url = "http://192.168.43.74:3000/api";
  // static root = "http://192.168.43.74:3000";
  static base_url = "http://23.106.139.14:3021/api";
  static root = "http://23.106.139.14:3021";
  static validate_code_url = Api.base_url + "/users/get_validate_code";
  static regist_url = Api.base_url + "/users/regist_user";
  static login_url = Api.base_url + "/users/login";
  static get_messages_by_km = Api.base_url   + "/messages/get_messages_by_km";
  static newMessagUrl = Api.base_url + "/messages/create";
  static updateMessageUrl = Api.base_url + "/messages/update_message";
  static getMessageById = Api.base_url + "/messages/get_messages_by_id";
  static like = Api.base_url + "/messages/like";
  static cancel_like = Api.base_url + "/messages/cancel_like";
  static deleteMessage = Api.base_url + "/messages/delete_messages_by_id";
  static getComments = Api.base_url + "/comments/get_messages_comments_by_id"
  static createComment = Api.base_url + "/comments/create"
  static commentLike = Api.base_url + "/comments/like";
  static cancelCommentLike = Api.base_url + "/comments/cancel_like";
  static deleteComment = Api.base_url + "/comments/delete";
  static uploadAvatar = Api.base_url + "/users/update_avatar";
  static updateNickname = Api.base_url + "/users/update_nickname";
  static updatePassword = Api.base_url + "/users/update_password";
  static getMessageByUser= Api.base_url + "/users/messages";
}
