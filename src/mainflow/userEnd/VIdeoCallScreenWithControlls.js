import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications


import 'react-native-gesture-handler';

import React from 'react';
import { useState , useEffect, useContext} from 'react';
import { StyleSheet, Text, View , TouchableOpacity , Dimensions, TextInput, BackHandler, Alert, Clipboard, ToastAndroid} from 'react-native';
import {StackActions} from '@react-navigation/native';
import Pusher from 'pusher-js/react-native';

import pusherConfig from '../pusher.json';
import AgoraUIKit from 'agora-rn-uikit';
import agoraConfig from "./AgorarChannels.json"

import NavigationButtons from './NavigationButtons';

import { setUpdateIntervalForType, SensorTypes, accelerometer ,gyroscope, orientation  } from "react-native-sensors";

import Ably from "ably";

import { ChannelContext } from '../../../App';

// const ably = new Ably.Realtime('4WmoOg.4SZS1g:w84M-soVmVHhJSbjdeEryB9MYYMIQ3WZSJVnEdMOsu4');
// const channel = ably.channels.get('ABLY');
// const channel2 = ably.channels.get('ABLY2');

const windowHeight = Dimensions.get('window').height;

const VideoCallHeight = windowHeight*(70/100);
const buttonsHeight = windowHeight*(30/100);

export default function VideoCallScreenWithControlls({navigation}){

    ////////////////// ABLY API ///////////////////////////

    const context = useContext(ChannelContext);


    ///// For Navigations
    const onSendMessage=(text)=>{
      context.channel.publish('MyCommand', text);
    }


      ////// For Angles
      const sendAngle=(text)=>{ 
        context.channel2.publish('MyAngles', text);
    }

    ////////////////// ABLY API ///////////////////////////


    ///////////////// Video Call //////////////////////
    const [callOption , setCallOption] = useState(null);
    const [callID , setCallID] = useState('')
    const [videoCall, setVideoCall] = useState(false);
    const rtcProps = {
        appId: '72c2e0389a9e4beabcddc99e0d15a9d1',
        token: agoraConfig.token,
        channel: agoraConfig.channelName
    };
    const callbacks = {EndCall: () => setVideoCall(false)};

    function checkId(Id){
      if(Id === rtcProps.appId){
        setVideoCall(true);
      }else{
        alert('Please Type Correct ID.')
      }
    }

    const backAction = () => {

      if(videoCall){
        Alert.alert("","Exit Call?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => {
            // BackHandler.exitApp()
            // navigation.dispatch(
            //       StackActions.replace('HomePageScreen'))
            // navigation.navigate('UserEndScreen')
            setVideoCall(false)
          }}
        ]);
        return true;
      }
      return;
        
    };
  
  
    useEffect(() => {
      
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();
    }, [videoCall]);

    ///////////////// Video Call //////////////////////


    ///////////////// Sensor readings //////////////////////
    const [data, setData] = useState(null);
    function quaternionToAngles(q){
        let data = q;
      
        let ysqr = data.qy * data.qy;
        let t0 = -2.0 * (ysqr + data.qz * data.qz) + 1.0;
        let t1 = +2.0 * (data.qx * data.qy + data.qw * data.qz);
        // let t2 = -2.0 * (data.qx * data.qz - data.qw * data.qy);
        let t3 = +2.0 * (data.qy * data.qz + data.qw * data.qx);
        let t4 = -2.0 * (data.qx * data.qx + ysqr) + 1.0;
      
        // t2 = t2 > 1.0 ? 1.0 : t2;
        // t2 = t2 < -1.0 ? -1.0 : t2;
      
        const toDeg = 180 / Math.PI;
      
        const euler = {};
        // euler.pitch = Math.asin(t2) * toDeg;
        euler.roll = Math.atan2(t3, t4) * toDeg;
        euler.yaw = Math.atan2(t1, t0) * toDeg;
     
        return euler;
    }


    useEffect(()=>{
      setUpdateIntervalForType(SensorTypes.orientation  ,500);
    },[]);

    

    useEffect(() => {

      let device_motion = orientation.subscribe(({qx, qy, qz, qw, pitch, roll, yaw}) =>{
        // setData({'qx':qx, 'qy':qy, 'qz':qz, 'qw':qw, 'pitch':pitch, 'roll':roll, 'yaw':yaw});
        let dat = {'qx':qx, 'qy':qy, 'qz':qz, 'qw':qw,};
        let euler = quaternionToAngles(dat);
  
        // setData({'roll':round(euler.roll), 'yaw':round(euler.yaw)});
        setData({'roll':getAngle('roll',euler.roll), 'yaw':getAngle('yaw',euler.yaw)});
          //  console.log('call')
        if (videoCall){
          if(data){
            if (data.roll === getAngle('roll',euler.roll) && data.yaw === getAngle('yaw',euler.yaw)){
                return null
            }else{
                // const txt = 'y = '+ getAngle('roll',euler.roll) + " z = " + getAngle('yaw',euler.yaw)
                const txt = getAngle('roll',euler.roll) + " " + getAngle('yaw',euler.yaw)
                // console.log('change')
                sendAngle(txt);
            }
          }
        }
      })

      return(()=>{
          device_motion.unsubscribe();
      })

    }, [data]);

    ///////////////// Sensor readings //////////////////////





    ///////////////// Pusher API /////////////////////////
    // const [messages , setMessages] = useState('')

    // useEffect(() => {        

    //     const pusher = new Pusher(pusherConfig.key, pusherConfig); // (1)
    //     const chatChannel = pusher.subscribe('chat_channel'); // (2)
    //     chatChannel.bind('pusher:subscription_succeeded', () => { // (3)
    //     chatChannel.bind('join', (data) => { // (4)
    //         handleJoin(data.name);
    //     });
    //     // chatChannel.bind('part', (data) => { // (5)
    //     //     handlePart(data.name);
    //     // });
    //     // chatChannel.bind('message', (data) => { // (6)
    //     //     handleMessage(data.name, data.message);
    //     // });
    //     });

    //     fetch(`${pusherConfig.restServer}/users/${'zain'}`, {
    //     method: 'PUT'
    //     });

    //     // return () => {
    //     //   setMessages('');
    //     //   // Anything in here is fired on component unmount.
    //     //   fetch(`${pusherConfig.restServer}/users/${'zain'}`, {
    //     //       method: 'DELETE'
    //     //   });
    //     // }

    //     return(()=>{
    //       chatChannel.unsubscribe('chat_channel');
    //     })
        

    // }, []);


    // const handleJoin=(name)=>{ 
    //     setMessages({action: 'join', name: name, message: 'Connected'})
    // }
        
    // const handlePart=(name)=>{
    //     setMessages({action: 'part', name: name , message: 'Disconnected'})
    // }
    
    // const handleMessage=(name, message)=>{
    //     setMessages({action: 'message', name: name, message: message})
    // } 


    // const onSendMessage=(text)=>{ // (9)
    //     const payload = {
    //         message: text
    //     };
    //     fetch(`${pusherConfig.restServer}/users/${'zain'}/messages`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(payload)
    //     });
    // }
    ///////////////// Pusher API /////////////////////////


    const showToastWithGravity = (msg) => {
      ToastAndroid.showWithGravity(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    };
    
    return(

        <View style={{flex:1}}> 

      {callOption ? 
        
        callOption==='join' ? 
          <View style={{flex:1 , justifyContent:'center' ,alignItems:'center',  backgroundColor:'white'}}>
            
              <TextInput
                style={{width:'85%', height:60, marginBottom:"10%", paddingHorizontal:10, textAlign:'center', borderColor: '#6e8aa1', borderWidth:4, borderRadius:10 ,color:'#848484', fontSize:14 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
                placeholder="Please type ID to Join the Call"
                placeholderTextColor = 'lightgray'
                onChangeText={(text)=>{setCallID(text)}}
              />

              <TouchableOpacity 
                  style={[styles.buttonStyle1 , {height:80, width:'55%', borderWidth:4}]}
                  onPress={()=>checkId(callID)}
                  >
                  <Text style={{color:'#ececec' ,fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Join Call</Text>
              </TouchableOpacity>

          </View>

          :

          videoCall ? 

            <View style={{flex:1 , flexDirection:'column'}}>

                <Text style={{color:'black'}}>{data.roll}</Text>
                <Text style={{color:'black'}}>{data.yaw}</Text>


                <View style={{height:'65%'}}>
                    <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> 
                </View>

                <View style={{height:'30%'}}>
                    {/* <NavigationButtons messages={ messages } onSendMessage={ onSendMessage } /> */}
                    <NavigationButtons onSendMessage={ onSendMessage } />
                </View>

            </View>
            :

            <View style={{flex:1 , justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>

                <Text style={{color:'#373738' ,fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Share ID with others to join this Call</Text>

                <TouchableOpacity 
                  onPress={() =>{
                    Clipboard.setString(rtcProps.appId)
                    showToastWithGravity("Copied!")
                  }}>
                  <Text style={{fontSize:19, color:'black', marginVertical:20, fontStyle:'italic'}}>{rtcProps.appId}</Text>
                </TouchableOpacity>


                <TouchableOpacity 
                    style={[styles.buttonStyle1 , {width:'55%', borderWidth:4}]}
                    onPress={()=>setVideoCall(true)}
                    >
                    <Text style={{color:'#ececec' ,fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Start Call</Text>
                </TouchableOpacity>

            </View>
      
        :
        
        <View style={{flex:1, alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'white'}}>

              <Text style={{color:'#848484', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>With Navigation</Text>

              <TouchableOpacity 
                  style={styles.buttonStyle}
                  onPress={()=>setCallOption('join')}
                  >
                  <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Join Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                  style={styles.buttonStyle}
                  onPress={()=>setCallOption('create')}
                  >
                  <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Create Call</Text>
              </TouchableOpacity>

        </View>
          
      }
      
    </View>


        // <View style={{flex:1 , flexDirection:'column'}}> 
            
        //     <View style={{height:VideoCallHeight}}>

        //         {videoCall ? 
                
        //         <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> 
                
        //         : 
                
        //         <Text onPress={()=>setVideoCall(true)}>Start Call</Text>}
        
        //     </View>
            
        //     <View style={{height:buttonsHeight}}>
        //         <NavigationButtons messages={ messages } onSendMessage={ onSendMessage } />
        //     </View>

        // </View>
        
    )
}


const styles = StyleSheet.create({

  buttonStyle:{
    width:'85%', 
    height:'25%', 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#a3c0e5', 
    borderWidth:5,
    borderColor:'#6e8aa1',
    borderRadius:25
  },
  buttonStyle1:{
    width:'85%', 
    height:'12%', 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#a3c0e5', 
    borderWidth:6,
    borderColor:'#6e8aa1',
    borderRadius:20
  },
})

function getAngle(type , angle){

    if(type === 'roll'){
      if(angle < 65){
        return 45
      }
      else if(angle >= 65 && angle < 110){
        return 90
      }
      else if(angle >= 110){
        return 135
      }

    }else if(type === 'yaw'){
      if(angle >= -90 && angle < 20){
        return 0
      }
      else if (angle >= 20 && angle < 65){
        return 45
      }
      else if (angle >= 65 && angle < 110){
        return 90
      } 
      else if (angle >= 110 && angle < 155){
        return 135
      }
      else if (angle >= 155 || angle < -90){
        return 180
      }
     
    }  
    
  
    // if (angle < 10){
    //   return 0
    // }
    // // else if (angle < 20){
    // //   return 15
    // // }
    // // else if (angle < 30){
    // //   return 25
    // // }
    // // else if (angle < 40){
    // //   return 35
    // // }
    // else if (angle < 50){
    //   return 45
    // }
    // // else if (angle < 60){
    // //   return 55
    // // }
    // // else if (angle < 70){
    // //   return 65
    // // }
    // // else if (angle < 80){
    // //   return 75
    // // }
    // // else if (angle < 90){
    // //   return 85
    // // }
    // else if (angle < 100){
    //   return 90
    // }
    // // else if (angle < 110){
    // //   return 105
    // // }
    // // else if (angle < 120){
    // //   return 115
    // // }
    // // else if (angle < 130){
    // //   return 125
    // // }
    // else if (angle < 140){
    //   return 135
    // }
    // // else if (angle < 150){
    // //   return 145
    // // }
    // // else if (angle < 160){
    // //   return 155
    // // }
    // // else if (angle < 170){
    // //   return 165
    // // }
    // else if (angle < 180){
    //   return 180
    // }


  }