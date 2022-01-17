import React from 'react';
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PermissionsAndroid } from "react-native";
import { ActivityIndicator } from "react-native";
import { Dimensions } from "react-native";
import { Share } from "react-native";

import RtcEngine from "react-native-agora";
import { ChannelProfile } from "react-native-agora";
import { ClientRole } from "react-native-agora";
import { RtcLocalView, RtcRemoteView } from "react-native-agora";
import { VideoRemoteState } from "react-native-agora";




export default function Live(props) {

  const AgoraEngine = useRef();
  const isBroadcaster = props.route.params.type === "create";

  const [joined, setJoined] = useState(false);
  const [broadcasterVideoState, setBroadcasterVideoState] = useState(VideoRemoteState.Decoding);
  const [uid , setUid] = useState(0);

  const onShare = async () => {
    try {
      await Share.share({ message: props.route.params.channel });
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSwitchCamera = () => AgoraEngine.current.switchCamera();

  const videoStateMessage = (state) => {
    switch (state) {
      case VideoRemoteState.Stopped:
        return "Video turned off by Host";
  
      case VideoRemoteState.Frozen:
        return "Connection Issue, Please Wait";
  
      case VideoRemoteState.Failed:
        return "Network Error";
    }
  };


  async function requestCameraAndAudioPermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted["android.permission.RECORD_AUDIO"] === PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.CAMERA"] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("You can use the cameras & mic");
      } else {
        console.log("Permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const init = async () => {
    AgoraEngine.current = await RtcEngine.create("72c2e0389a9e4beabcddc99e0d15a9d1");
    await AgoraEngine.current.enableVideo();
    await AgoraEngine.current.setChannelProfile(ChannelProfile.LiveBroadcasting);
    
    if (isBroadcaster){
      await AgoraEngine.current.setClientRole(ClientRole.Broadcaster);
    }
    

    AgoraEngine.current.addListener("JoinChannelSuccess", (channel, uid, elapsed) => {
      console.log("JoinChannelSuccess");
      setJoined(true);
    });
    
    AgoraEngine.current.addListener("RemoteVideoStateChanged", (uid, state) => {
      if (uid === 1) setBroadcasterVideoState(state);
    });
  };

  useEffect(() => {
    if (Platform.OS === 'android'){
      isBroadcaster ? setUid(1) : setUid(0);
      requestCameraAndAudioPermission().then(()=>{
          init().then(()=>{
            // engine.joinChannel(null, props.route.params.channel, null, uid);
            AgoraEngine.current.joinChannel('00672c2e0389a9e4beabcddc99e0d15a9d1IAC5W+KMppWU2M++xDl3sty6tzFIe8uMtLfVN+Fpb8lZHUOQEggAAAAAEABLPQ3JlEnlYQEAAQCUSeVh',props.route.params.channel, null, uid);
            // AgoraEngine.current.joinChannel('00672c2e0389a9e4beabcddc99e0d15a9d1IACzoBmbgTr3rGqFvi9ZcPOorsXwb1/0usVfg5c2VXtntkOQEggAAAAAEADC8VeAmXXkYQEAAQCadeRh','myChannel', null, uid);
          
          })
      })
    }

    return () => {
      setUid(0);
      AgoraEngine.current.destroy();
    }
  }, [])


  return (
    <View style={styles.container}>
      {!joined ? (
        <>
          <ActivityIndicator
            size={60}
            color="#222"
            style={styles.activityIndicator}
          />
          <Text style={styles.loadingText}>Joining Stream, Please Wait</Text>
        </>
        ) : (
            <>
              {isBroadcaster ? (
                <RtcLocalView.SurfaceView 
                  style={styles.fullscreen} 
                  channelId={props.route.params.channel} 
                />
                ) : (
                  broadcasterVideoState === VideoRemoteState.Decoding ? (
                    <RtcRemoteView.SurfaceView 
                    uid={1} 
                    style={styles.fullscreen} 
                    channelId={props.route.params.channel} 
                    />
                  ) : (
                    <View style={styles.broadcasterVideoStateMessage}>
                      <Text style={styles.broadcasterVideoStateMessageText}>{videoStateMessage(broadcasterVideoState)}</Text>
                    </View>
                )
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onShare}>
                  <Text style={styles.shareText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={onSwitchCamera}>
                  <Text style={styles.buttonText}>Switch Camera</Text>
                </TouchableOpacity>
              </View>

              
            </>
      )}


    </View>
  );
}


const dimensions = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#222',
  },
  fullscreen: {
    width: dimensions.width,
    height: dimensions.height,
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    width: 150,
    backgroundColor: '#fff',
    marginBottom: 50,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 17,
  },
  broadcasterVideoStateMessage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  broadcasterVideoStateMessageText: {
    color: '#fff',
    fontSize: 20,
  },
});