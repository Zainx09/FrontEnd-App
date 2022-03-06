import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

import 'react-native-gesture-handler';

import React from 'react';
import { useState , useEffect} from 'react';
import { StyleSheet, Text, View , TouchableOpacity , Dimensions , TextInput} from 'react-native';

import Pusher from 'pusher-js/react-native';
import pusherConfig from '../pusher.json';
import AgoraUIKit from 'agora-rn-uikit';


import { setUpdateIntervalForType, SensorTypes, accelerometer ,gyroscope, orientation  } from "react-native-sensors";

const windowHeight = Dimensions.get('window').height;

const VideoCallHeight = windowHeight*(80/100);
const buttonsHeight = windowHeight*(20/100);

// Pusher.logToConsole = true;
// const pusher = new Pusher(pusherConfig.key, pusherConfig); // (1)
//         const chatChannel = pusher.subscribe('chat_channel'); // (2)
//         chatChannel.bind('pusher:subscription_succeeded', () => { // (3)
//         chatChannel.bind('join', (data) => { // (4)
//             handleJoin(data.name);
//         });
//         chatChannel.bind('part', (data) => { // (5)
//             handlePart(data.name);
//         });
//         chatChannel.bind('message', (data) => { // (6)
//             handleMessage(data.name, data.message);
//         });
//         });

//         // Anything in here is fired on component mount.
//         fetch(`${pusherConfig.restServer}/users/${'zain'}`, {
//         method: 'PUT'
//         });

//     const handleJoin=(name)=>{ 
//         // setMessages({action: 'join', name: name, message: 'Connected'})
//     }
        
//     const handlePart=(name)=>{
//         // setMessages({action: 'part', name: name , message: 'Disconnected'})
//     }
    
//     const handleMessage=(name, message)=>{
//         // setMessages({action: 'message', name: name, message: message})
//     } 


    



export default function VideoCallScreenWithVirtualControlls({navigation}){

    // const [data, setData] = useState(null);

    ///////////////// Video Call //////////////////////
    const [callOption , setCallOption] = useState(null);
    const [callID , setCallID] = useState('')
    const [videoCall, setVideoCall] = useState(false);
    const rtcProps = {
        appId: '72c2e0389a9e4beabcddc99e0d15a9d1',
        token:'00672c2e0389a9e4beabcddc99e0d15a9d1IAAjyE5HNSwDIi8bRxSMHVMyFnnMUznTvW7DekXUNsDgl0OQEggAAAAAEADbqsx0Spr+YQEAAQBKmv5h',
        channel: 'myChannel'
    };
    const callbacks = {EndCall: () => setVideoCall(false)};

    function checkId(Id){
      if(Id === rtcProps.appId){
        setVideoCall(true);
      }else{
        alert('Please Type Correct ID.')
      }
    }
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
      setUpdateIntervalForType(SensorTypes.orientation  , 500);
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
                const txt = 'y = '+ getAngle('roll',euler.roll) + " z = " + getAngle('yaw',euler.yaw)
                // console.log('change')
                onSendMessage(txt);
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
    const [messages , setMessages] = useState('')

    useEffect(() => {        

        const pusher = new Pusher(pusherConfig.key, pusherConfig); // (1)
        const chatChannel = pusher.subscribe('chat_channel'); // (2)
        chatChannel.bind('pusher:subscription_succeeded', () => { // (3)
        chatChannel.bind('join', (data) => { // (4)
            handleJoin(data.name);
        });
        // chatChannel.bind('part', (data) => { // (5)
        //     handlePart(data.name);
        // });
        // chatChannel.bind('message', (data) => { // (6)
        //     handleMessage(data.name, data.message);
        // });
        });

        fetch(`${pusherConfig.restServer}/users/${'zain'}`, {
        method: 'PUT'
        });

        // return () => {
        //   setMessages('');
        //   // Anything in here is fired on component unmount.
        //   fetch(`${pusherConfig.restServer}/users/${'zain'}`, {
        //       method: 'DELETE'
        //   });
        // }

        return(()=>{
          chatChannel.unsubscribe('chat_channel');
        })
        

    }, []);


    const handleJoin=(name)=>{ 
        setMessages({action: 'join', name: name, message: 'Connected'})
    }
        
    const handlePart=(name)=>{
        setMessages({action: 'part', name: name , message: 'Disconnected'})
    }
    
    const handleMessage=(name, message)=>{
        setMessages({action: 'message', name: name, message: message})
    } 


    const onSendMessage=(text)=>{ // (9)
        const payload = {
            message: text
        };
        fetch(`${pusherConfig.restServer}/users/${'zain'}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
        });
    }
    ///////////////// Pusher API /////////////////////////




    return (
      // <View style={{flex:1}}>
      //   <Text>{messages?messages.message:'ABCD'}</Text>
      // </View>

      <View style={{flex:1}}> 

      {callOption ? 
        
        callOption==='join' ? 
          <View style={{flex:1 , justifyContent:'center' , marginHorizontal:30}}>
            <View
              style={{alignItems:'center'}}>
                <TextInput
                  style={{width:'80%', height: 45, marginVertical:10, paddingHorizontal:10, textAlign:'center', borderColor: 'black', borderWidth: 1,
                  color:'black'}}
                  placeholder="Please type ID to Join the Call"
                  onChangeText={(text)=>{setCallID(text)}}
                />

                <TouchableOpacity 
                    style={{width:'60%', height:80, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
                    onPress={()=>checkId(callID)}
                    >
                    <Text style={{color:'black', fontSize:20}}>Join Call</Text>
                </TouchableOpacity>

            </View>
          </View>

          :

          videoCall ? 
            <>
              <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> 
            </>

            :

            <View style={{flex:1 , justifyContent:'center' , marginHorizontal:30}}>
              <View
                  style={{alignItems:'center'}}>
                      <Text style={{fontSize:12 , color:'black'}}>Share ID with others to join this Call</Text>
                      <Text style={{fontSize:16, color:'black', marginVertical:10}}>{rtcProps.appId}</Text>

                      <TouchableOpacity 
                          style={{width:'60%', height:80, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
                          onPress={()=>setVideoCall(true)}
                          >
                          <Text style={{color:'black', fontSize:20}}>Start Call</Text>
                      </TouchableOpacity>

              </View>
            </View>
      
        :
        
        <View style={{flex:1 , justifyContent:'center' , marginHorizontal:30}}>
          <View
              style={{alignItems:'center'}}>

                <TouchableOpacity 
                    style={{width:'60%', height:80, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
                    onPress={()=>setCallOption('join')}
                    >
                    <Text style={{color:'black', fontSize:20}}>Join Call</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={{width:'60%', height:80, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
                    onPress={()=>setCallOption('create')}
                    >
                    <Text style={{color:'black', fontSize:20}}>Create Call</Text>
                </TouchableOpacity>

            </View>
        </View>
          
      }
      
    </View>
  );
}




function getAngle(type , angle){

    if(type === 'roll'){
      if (angle > 160){
        return 155
      }else if(angle > -90 && angle < 20){
        return 25
      }else if(angle < -90){
        return 155
      }
  
    }else if(type === 'yaw'){
      if(angle > -90 && angle < 0){
        return 5
      }else if(angle < -90){
        return 175
      }
    }
  
    
  
    if (angle < 10){
      return 5
    }else if (angle < 20){
      return 15
    }else if (angle < 30){
      return 25
    }else if (angle < 40){
      return 35
    }else if (angle < 50){
      return 45
    }else if (angle < 60){
      return 55
    }else if (angle < 70){
      return 65
    }else if (angle < 80){
      return 75
    }else if (angle < 90){
      return 85
    }else if (angle < 100){
      return 95
    }else if (angle < 110){
      return 105
    }else if (angle < 120){
      return 115
    }else if (angle < 130){
      return 125
    }else if (angle < 140){
      return 135
    }else if (angle < 150){
      return 145
    }else if (angle < 160){
      return 155
    }else if (angle < 170){
      return 165
    }else if (angle < 180){
      return 175
    }
  }
  
  function round(n) {
      if (!n) {
        return 0;
      }
      return Math.floor(n * 100) / 100;
    }
  