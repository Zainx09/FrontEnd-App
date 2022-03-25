import 'react-native-gesture-handler';
import { useState , useEffect, useContext} from 'react';
import React from 'react';
import Pusher from 'pusher-js/react-native';
import { StyleSheet, Text, View , TouchableOpacity , TextInput, ToastAndroid, Clipboard, BackHandler, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {StackActions} from '@react-navigation/native';

import AgoraUIKit from 'agora-rn-uikit';
import agoraConfig from "../userEnd/AgorarChannels.json"

import Icon from 'react-native-vector-icons/FontAwesome';

import pusherConfig from '../pusher.json';

import BluetoothSerial from 'react-native-bluetooth-serial-2'

import Ably from "ably";

import { ChannelContext } from '../../../App';

// const ably = new Ably.Realtime('4WmoOg.4SZS1g:w84M-soVmVHhJSbjdeEryB9MYYMIQ3WZSJVnEdMOsu4');
// const channel = ably.channels.get('ABLY'); // for movement
// const channel2 = ably.channels.get('ABLY2'); // for angles


export default function RoboticEndUI({navigation}){
  

  ////////////////// ABLY API ///////////////////////////

  const context = useContext(ChannelContext);

  const [message , setMessage] = useState('');

  const [y ,setY] = useState('');
  const [z ,setZ] = useState('');
  const [angle , setAngles] = useState('');

  useEffect(()=>{
    // const channel = context.channel;
    // const channel2 = context.channel2;

    context.channel.subscribe('MyCommand' , (message)=>{
      handleMessage(message.data)
    });

    context.channel2.subscribe('MyAngles' , (angle)=>{
      handleAngle(angle.data)
    });

    return(()=>{
      context.channel.unsubscribe('MyCommand');
      context.channel2.unsubscribe('MyAngles');
    })
  },[]);

  const handleMessage=(message)=>{
    setMessage(message)
    switch(message) {
      case "LEFT IN":
        write_data('L')
        break;

      case "RIGHT IN":
        write_data('R')
        break;

      case "GO IN":
        write_data('F')
        break;

      case "BACK IN":
        write_data('B')
        break;

      case "LEFT OUT":
        write_data('C')
        break;

      case "RIGHT OUT":
        write_data('C')
        break;

      case "GO OUT":
        write_data('C')
        break;

      case "BACK OUT":
        write_data('C')
        break;

      default:
        // write_data('C');
        break
    }
    // write_data()
    
  } 

  // z axis = 18 letters.
  // y axis = 12 letters.
  const handleAngle=(angle)=>{
    
    setY(angle.split(" ")[0]);
    setZ(angle.split(" ")[1]);
    // setAngles(angle)

    switch(angle.split(" ")[0]) {

      case "135":
        write_data('a')
        break;

      case "90":
        write_data('b')
        break;

      case "45":
        write_data('c')
        break;

      default:
        // write_data('C');
        break
      }


    switch(angle.split(" ")[1]) {
      case "0":
        write_data('d')
        break;

      case "45":
        write_data('e')
        break;

      case "90":
        write_data('f')
        break;

      case "135":
        write_data('g')
        break;

      case "180":
        write_data('h')
        break;
        
      default:
        // write_data('C');
        break
      }
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
          // navigation.navigate('HomePageScreen')
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




  ///////////////// Pusher API /////////////////////////
  // useEffect(() => {
  //   const pusher = new Pusher(pusherConfig.key, pusherConfig); // (1)
  //   const chatChannel = pusher.subscribe('chat_channel'); // (2)
  //   chatChannel.bind('pusher:subscription_succeeded', () => { // (3)
  //     chatChannel.bind('join', (data) => { // (4)
  //       handleJoin(data.name);
  //     });
  //     chatChannel.bind('part', (data) => { // (5)
  //       handlePart(data.name);
  //     });
  //     chatChannel.bind('message', (data) => { // (6)
  //       handleMessage(data.name, data.message);
  //     });
  //   });

  //   // Anything in here is fired on component mount.
  //   fetch(`${pusherConfig.restServer}/users/${'zain'}`, {
  //     method: 'PUT'
  //   });

  //   // return () => {
  //   //   // Anything in here is fired on component unmount.
  //   //   fetch(`${pusherConfig.restServer}/users/${'zain'}`, {
  //   //       method: 'DELETE'
  //   //   });
  //   // }

  //   return(()=>{
  //     chatChannel.unsubscribe('chat_channel');
  //   })

  // }, []);


  // const handleJoin=(name)=>{ 
  //   setMessages({action: 'join', name: name, message: 'Connected'})
  // }
    
  // const handlePart=(name)=>{
  //   setMessages({action: 'part', name: name , message: 'Disconnected'})
  // }
   
  // const handleMessage=(name, message)=>{
  //   switch(message) {
  //     case "LEFT IN":
  //       write_data('L')
  //       setMessages({action: 'message', name: name, message: message})
  //       break;

  //     case "RIGHT IN":
  //       write_data('R')
  //       setMessages({action: 'message', name: name, message: message})
  //       break;

  //     case "GO IN":
  //       write_data('F')
  //       setMessages({action: 'message', name: name, message: message})
  //       break;

  //     case "BACK IN":
  //       write_data('B')
  //       setMessages({action: 'message', name: name, message: message})
  //       break;

  //       case "LEFT OUT":
  //         write_data('C')
  //         setMessages({action: 'message', name: name, message: message})
  //         break;
  
  //       case "RIGHT OUT":
  //         write_data('C')
  //         setMessages({action: 'message', name: name, message: message})
  //         break;
  
  //       case "GO OUT":
  //         write_data('C')
  //         setMessages({action: 'message', name: name, message: message})
  //         break;
  
  //       case "BACK OUT":
  //         write_data('C')
  //         setMessages({action: 'message', name: name, message: message})
  //         break;

  //     default:
  //       // write_data('C');
  //       break
  //   }
  //   // write_data()
    
  // } 

  ///////////////// Pusher API /////////////////////////


  


  ////////////////// Bluetooth Code ////////////////////

  const [connected , setConnected] = useState(false);


  const showToastWithGravity = (msg) => {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };
 
  async function connect_Bt(){
    try{
      let en = await BluetoothSerial.isEnabled();

      if(!en){
        showToastWithGravity("Please Enable Bluetooth.")
        // console.log("Please Enable Bluetooth.")
        return
      }
      await BluetoothSerial.connect("00:21:11:01:CB:B9");

      let check = BluetoothSerial.isConnected();

      if (check){
        setConnected(true);
        showToastWithGravity("Connected")
      }else{
        showToastWithGravity("Something Went Wrong")
        setConnected(false);
      }

    }catch(err){
      setConnected(false);
      showToastWithGravity(err.message)
    } 
  }
  

  async function write_data(key){
    let check = BluetoothSerial.isConnected();
    if (!check) {
      // showToastWithGravity("Must be connected!!");
      console.log("Must be connected!!");
      return
    }else{

      try{
        await BluetoothSerial.write(key);

      }catch(err){
        setConnected(false);
        // showToastWithGravity(err.message);
        console.log(err.message)
      }
    }
    
    //C=67
    //F=70
    //B=66
    //L=76
    //R=82
    //U=85
    //D=68

    //X=88
    //Y=89
      
    // await BluetoothSerial.write(key)
    // .then((res) => {
    //  console.log("Writed");
    // })
    // .catch((err) => {
    //   setConnected(false);
    //   showToastWithGravity(err.message);
    //   console.log(err.message)
    // })
  }

  // async function BT_List(){
  //   try{
  //     let en = await BluetoothSerial.list();
  //     console.log(en);
  //   }catch(err){
  //     console.log('Error ------ ' , err)
  //   }
  // }

  ////////////////// Bluetooth Code ////////////////////  

  return (
    // <View style={{flex:1}}>
    //   <Text>{messages?messages.message:'ABCD'}</Text>
    // </View>

    <View style={{flex:1}}> 

    {callOption ? 
      
      callOption==='join' ? 
        <View style={{flex:1 , justifyContent:'center' ,alignItems:'center',  backgroundColor:'white'}}>
          
              <TextInput
                style={{width:'85%', height:60, marginBottom:"10%", paddingHorizontal:10, textAlign:'center', borderColor: '#8aae60', borderWidth:4, borderRadius:10 ,color:'#848484', fontSize:14 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
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
            <View style={{height:'12%' , backgroundColor:'white'}}>
              {/* <Text style={{color:'black'}}> {messages.message} </Text> */}
              <Text style={{color:'black'}}>{message} </Text>
              <Text style={{color:'black'}}>{y} </Text>
              <Text style={{color:'black'}}>{z} </Text>
            </View>
            <View style={{height:'88%'}}>
              <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> 
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
      
      <View style={{flex:1 , alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'white'}}>
  
              <Text style={{color:'#848484', fontSize:25 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Robotic End</Text>
              
              <TouchableOpacity 
                  style={[styles.buttonStyle1, {height:'16%'}]}
                  onPress={()=>setCallOption('join')}
                  >
                  <Text style={{color:'white', fontSize:18 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Join Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                  style={[styles.buttonStyle1, {height:'16%'}]}
                  onPress={()=>setCallOption('create')}
                  >
                  <Text style={{color:'white', fontSize:18 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Create Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                  style={styles.buttonStyle1}
                  onPress={()=>connect_Bt()}
                  >
                  <Text style={{color:'white', fontSize:18 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Connect Bluetooth</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity 
                  style={{width:'80%', height:60, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black' , backgroundColor:'lightblue'}}
                  onPress={()=>BT_List()}
                  >
                  <Text style={{color:'black', fontSize:15}}>Bluetooth List</Text>
              </TouchableOpacity> */}

              {connected 
                &&
              <>
              
              <Text style={{color:'#373738', fontSize:15 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>
                Test Movements
              </Text>

              <View style={{width:'100%' , height:'8%' , flexDirection:'row' , justifyContent:'space-evenly'}}>

                <TouchableOpacity 
                    style={styles.testMovement}
                    onPressIn={()=>write_data('F')} onPressOut={()=>write_data("C")}
                    >
                    <Text style={{color:'#373738', fontSize:12, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>GO</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.testMovement}
                    onPressIn={()=>write_data('B')} onPressOut={()=>write_data("C")}
                    >
                    <Text style={{color:'#373738', fontSize:12, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>BACK</Text>
                </TouchableOpacity>

              </View>

              <Text style={{color:'#373738', fontSize:15 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>
                Test Head Rotation
              </Text>

              <View style={{width:'100%' , height:'8%' , flexDirection:'row' , justifyContent:'space-evenly'}}>

                <TouchableOpacity 
                    style={styles.testMovement}
                    onPressIn={()=>write_data('a')} onPressOut={()=>write_data("c")}
                    >
                    <Text style={{color:'#373738', fontSize:12, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>UP</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.testMovement}
                    onPressIn={()=>write_data('d')} onPressOut={()=>write_data("h")}
                    >
                    <Text style={{color:'#373738', fontSize:12, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>LEFT</Text>
                </TouchableOpacity>

              </View>
              </>}


              {/* <TouchableOpacity 
                  style={{width:'60%', height:80, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black' , backgroundColor:'green'}}
                  onPressIn={()=>write_data('F')} onPressOut={()=>write_data("C")}
                  >
                  <Text style={{color:'black', fontSize:15}}>Check Forward Drive</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                  style={{width:'60%', height:80, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black' , backgroundColor:'green'}}
                  onPressIn={()=>write_data('a')} onPressOut={()=>write_data("l")}
                  >
                  <Text style={{color:'black', fontSize:15}}>Check Servo Angles</Text>
              </TouchableOpacity> */}

      </View>
        
    }
    </View>
  );
}


const styles = StyleSheet.create({

  buttonStyle1:{
    width:'85%', 
    height:'10%', 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#a7ca7f', 
    borderWidth:6,
    borderColor:'#8aae60',
    borderRadius:20
  }
  ,
  testMovement:{
    width:'35%', 
    height:'100%',
    alignItems:'center', 
    justifyContent:'center', 
    borderWidth:3, 
    borderStyle:'solid' , 
    borderColor:'#7d8081' , 
    borderRadius:20,
    backgroundColor:'#93989a'
  }
})
