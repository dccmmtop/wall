import React, { Component } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image
} from "react-native";

let Dimensions = require("Dimensions");
let SCREEN_WIDTH = Dimensions.get("window").width; //宽
let SCREEN_HEIGHT = Dimensions.get("window").height; //高

export default class ModalDialog extends Component {
  // 构造
  constructor(props) {
    super(props);
    // this.props.modalVisible = true;
  }
  componentDidMount = () => {
    console.log("999999999999999999");
  }

  render() {
    return (
      <Modal
        visible={true}
        transparent={true}
        onRequestClose={() => {}} //如果是Android设备 必须有此方法
      >
        <View style={styles.bg}>
          <View style={styles.dialog}>
            {/* onPress事件直接与父组件传递进来的属性挂接 */}
            <TouchableOpacity
              style={styles.dialogBtnViewItem}
              onPress={() => {
              
              }}
            >
              <Text>
                start
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  //全屏显示 半透明 可以看到之前的控件但是不能操作了
  bg: {
    backgroundColor: "rgba(52,52,52,0.5)", //rgba  a0-1  其余都是16进制数
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  dialog: {
    width: SCREEN_WIDTH * 0.65,
    height: SCREEN_HEIGHT * 0.2,
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 4
  },
  dialogBtnViewItem: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    width: 50,
    height: 50
  }
});
