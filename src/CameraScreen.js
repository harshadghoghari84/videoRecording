import React, { Component, useRef, useState } from 'react'
import { Text, View, StyleSheet, StatusBar, ToastAndroid, TouchableOpacity, ActivityIndicator } from 'react-native'
import { RNCamera } from 'react-native-camera'
import CameraRoll from "@react-native-community/cameraroll";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'


// const PendingView = () => (
//   <View style={{ flex: 1, backgroundColor: 'lightgreen', justifyContent: 'center', alignItems: 'center' }}>
//     <ActivityIndicator size="small" />
//   </View>
// )
export class CameraScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videoData: null,
      videoRecording: false,
      data: null,
      flashMode: false,
      backCamera: false,
      seconds: 0,
      maxDuration: 300,
      captureAudio: true,
      recording: false,
      itemData: null,

    }
  }

  secondsToMMS = (seconds: number) => {
    let m = Math.floor(seconds / 60)
    let s = Math.floor(seconds % 60)

    let mDisplay = m < 10 ? `0${m}` : `${m}`;
    let sDisplay = m < 10 ? `0${s}` : `${s}`;
    return `${mDisplay}:${sDisplay}`;
  }

  controlFlashMode = () => {
    this.setState({ flashMode: !this.state.flashMode })

  }

  reverseCamera = () => {
    if (this.state.recording) {
      clearInterval(this.countRecordTime);
      this.setState({ seconds: 0 });
    }
    let backCamera = !this.state.backCamera;
    if (backCamera) {
      ToastAndroid.show('reverse to back camera', ToastAndroid.SHORT)
    } else {
      ToastAndroid.show('reverse to Front camera', ToastAndroid.SHORT)
    }
    this.setState({ backCamera })
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 1 };
      const data = await this.camera.takePictureAsync(options);
      //save picture to gallary
      CameraRoll.save(data.uri, 'photo')
        .then(onfulfilled => {
          ToastAndroid.show(onfulfilled, ToastAndroid.SHORT);
        }).catch(error => {
          ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
        })
      console.log(image = data.uri)
      this.setState({ itemData: data.uri })
    }
  }

  recordVideo = async () => {
    if (this.camera) {
      if (!this.state.recording) {
        this.startRecording()
      } else {
        this.stopRecording()
      }
    }
  }

  startRecording = async () => {
    // ToastAndroid.show('record sta rt', ToastAndroid.SHORT)
    this.setState({ recording: true })
    this.countRecordTime = setInterval(() => this.setState({ seconds: this.state.seconds + 1 }), 1000);
    const cameraConfig = { maxDuration: this.state.maxDuration }
    const data = await this.camera.recordAsync(cameraConfig)
    this.setState({ recording: false })
    CameraRoll.save(data.uri, 'Video')
      .then(onfulfilled => {
        ToastAndroid.show('Record Video', ToastAndroid.SHORT)
      }).catch(error => ToastAndroid.show(`${error.message}`), ToastAndroid.SHORT)
    this.setState({ videoData: data.uri })
  }

  stopRecording = () => {
    this.camera.stopRecording();
    clearInterval(this.countRecordTime);
    this.setState({ seconds: 0 })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          translucent={false}
          backgroundColor="#000"
          networkActivityIndicatorVisible={true}
        />
        <View style={{ zIndex: 1, paddingVertical: 20 }}>
          <TouchableOpacity
            style={[styles.iconContainer, { marginHorizontal: 20 }]}
            onPress={this.controlFlashMode}
          >
            <Ionicons
              style={styles.icon}
              size={30}
              color="white"
              name={this.state.flashMode ? 'flash' : 'flash-off'}
            />
          </TouchableOpacity>
          {
            this.state.recording ? (<Text style={{ color: 'red', alignSelf: 'center', bottom: 20 }}>{this.secondsToMMS(this.state.seconds)}</Text>) : (null)
          }
        </View>
        <RNCamera
          ref={camera => this.camera = camera}
          style={styles.preview}
          type={this.state.backCamera ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
          flashMode={this.state.flashMode == true ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
          captureAudio={this.state.captureAudio}
        >

          {
            ({ camera, status, recordAudioPermissionStatus }) => {
              if (status !== 'READY') return <ActivityIndicator size="small" />
              return (
                <View style={styles.actions}>
                  <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('SaveItem', { data: this.state.itemData })}
                      style={styles.storePicture} />

                    <TouchableOpacity
                      onPress={this.takePicture}
                      style={styles.inrCircleForTakePicture} />

                    <View
                      style={styles.circleBorder}>

                      <TouchableOpacity
                        onPress={this.recordVideo}
                        style={[styles.inrCircle, { backgroundColor: this.state.recording ? 'grey' : 'red' }]} />

                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={this.reverseCamera}
                  >
                    <EvilIcons
                      style={styles.icon}
                      size={50}
                      color="white"
                      name="refresh"
                    />
                  </TouchableOpacity>
                </View>
              )
            }
          }
        </RNCamera>
      </View>
    )
  }
}

export default CameraScreen

const styles = StyleSheet.create({
  preview: {
    height: "100%",
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // paddingBottom: 30,
    alignSelf: 'center',
    position: 'absolute'
  },
  circleBorder: {
    height: 60,
    width: 60,
    borderColor: 'white',
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,


  },
  storePicture: {
    height: 60,
    width: 60,
    borderRadius: 50,
    opacity: 0.8,
    backgroundColor: 'grey'

  },
  inrCircle: {
    height: "90%",
    width: "90%",
    borderRadius: 50,
    opacity: 0.8
  },
  inrCircleForTakePicture: {
    height: 60,
    width: 60,
    borderRadius: 50,
    backgroundColor: "white",
    opacity: 0.8,
    marginLeft: 10
  },
  actions: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white',
    width: "100%",
  },
  iconContainer: {
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  icon: {
    marginHorizontal: 5
  }
})