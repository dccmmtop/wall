export default class Api {
  static base_url = "http://192.168.31.177:3000/api";
  static validate_code_url = Api.base_url + "/users/get_validate_code";
  static regist_url = Api.base_url + "/users/regist_user";
  static login_url = Api.base_url + "/users/login";
  static get_messages_by_km = Api.base_url   + "/messages/get_messages_by_km";
  static newMessagUrl = Api.base_url + "/messages/create";
  static getMessageById = Api.base_url + "/messages/get_messages_by_id";
}
