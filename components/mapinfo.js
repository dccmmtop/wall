import React, {Component} from 'react';
import {  Button, StyleSheet, Text, View, TouchableOpacity,Image} from "react-native"
import { MapView } from 'react-native-amap3d';
import { Geolocation } from "react-native-amap-geolocation";

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      markers: [],
      location: {
        longitude: 0,
        latitude: 0
      }
    }
    //我的实时位置
    this._position = {
      longitude: 0,
      latitude: 0
    };
  }
  async componentDidMount() {
    await Geolocation.init({
      android: "21f2e5a2ce0b635a4cabf4d437e70031"
    })
    Geolocation.setOptions({
      interval: 1000,
      distanceFilter: 0,
      background: true,
      reGeocode: true
    })
    Geolocation.addLocationListener(location =>
        this.updateLocationState(location)
    )
    Geolocation.start()
  }

  componentWillUnmount() {
    Geolocation.stop()
  }

  updateLocationState(location) {
    if (location) {
      if(this._position.latitude == 0){
        this._position = location
        this._animatedToZGC(this._position,1)
      }
      else{
        this._position = location
        }
      console.log(this._position)
    }
  }
  _animatedToZGC = (position, duration) => {
    if (!duration) duration = 500;
    this.mapView.animateTo(
      {
        tilt: 0,
        rotation: 0,
        zoomLevel: 14,
        coordinate: position
      },
      duration
    );
  };

  startLocation = () => {
    Geolocation.start()
  }
  stopLocation = () => Geolocation.stop()
  getLastLocation = async () =>
    this.updateLocationState(await Geolocation.getLastLocation())

  render() {
    return (
      <View style={styles.container}>
        <MapView style={StyleSheet.absoluteFill}
          ref={ref => (this.mapView = ref)}
          locationEnabled
          showsScale
          showsZoomControls={false}
          zoomLevel={14}
        />
        <View style={styles.navGroup}>
          <View style={{ flexGrow: 2 }}>
            <TouchableOpacity
              onPress={() => this._animatedToZGC(this._position)}
            >
              <Image
                style={[styles.imgSm, styles.navCenter]}
                source={require("../icons/location.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  centerImgWrap: {
    alignItems: "center",
    alignSelf: "center"
  },
  centerImg: {
    marginBottom: 40,
    width: 25.9064,
    height: 40
  },
  title: {
    fontSize: 20,
    color: "black"
  },
  navGroup: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0
  },
  imgSm: {
    height: 60,
    width: 60
  },
  imgMd: {
    height: 100,
    width: 100
  },
  navCenter: {
    alignSelf: "center"
  },
  flex: {
    flex: 1
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
    color: "#6699CC",
    fontWeight: "bold"
  }
});
