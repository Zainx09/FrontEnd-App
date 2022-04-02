import 'react-native-gesture-handler';
import { useState , useEffect, useContext} from 'react';
import React from 'react';
import Pusher from 'pusher-js/react-native';
import { StyleSheet, Text, View , TouchableOpacity , ToastAndroid, Clipboard, BackHandler, Alert, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {StackActions} from '@react-navigation/native';

//RN Paper
import { TextInput, Button } from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome5';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import AgoraUIKit from 'agora-rn-uikit';
import agoraConfig from "../userEnd/AgorarChannels.json"

import pusherConfig from '../pusher.json';

import BluetoothSerial from 'react-native-bluetooth-serial-2'

import Ably from "ably";

import { ChannelContext } from '../../../App';

// const ably = new Ably.Realtime('4WmoOg.4SZS1g:w84M-soVmVHhJSbjdeEryB9MYYMIQ3WZSJVnEdMOsu4');
// const channel = ably.channels.get('ABLY'); // for movement
// const channel2 = ably.channels.get('ABLY2'); // for angles


export default function RoboticEndUI({navigation}){

  //for Button
  const [loading , setLoading] = useState(false);
  const [disable , setDisable] = useState(false);
  

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

  const [rtcProps, setRtcProps] = useState({})

  // let rtcProps = {};

  function CallOptions(option){
    setCallOption(option)

    if(option === 'join'){
      setRtcProps({
        appId: agoraConfig.appId,
        token: agoraConfig.token,
        channel: agoraConfig.channelName
      })

    }else if(option === 'create'){

      setRtcProps({
        appId: agoraConfig.appId2,
        token: agoraConfig.token2,
        channel: agoraConfig.channelName2
      })
    }
  }

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
          
          setVideoCall(false);
          
          
        }}
      ]);
      return true;
    }else if(callOption !== null){
      setCallOption(null);
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
  }, [videoCall, callOption]);

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

  const [connected , setConnected] = useState(true);


  const showToastWithGravity = (msg) => {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };
 
  async function connect_Bt(){
    setLoading(true); setDisable(true);
    try{
      let en = await BluetoothSerial.isEnabled();

      if(!en){
        setLoading(false); setDisable(false);
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
        setLoading(false); setDisable(false);
        showToastWithGravity("Please Try Again!")
        setConnected(false);
      }

    }catch(err){
      setLoading(false); setDisable(false);
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
                style={{width:'85%',fontSize:14 , fontFamily:'sans-serif-medium' , fontWeight:'bold', marginBottom:20}}
                placeholder="Type Call ID Here"
                placeholderTextColor = 'lightgray'
                onChangeText={(text)=>{setCallID(text)}}
                mode="outlined"
                label="Call ID"
                left={<TextInput.Icon name="call-made" size={20} color="gray"/>}
              />

              {/* <TouchableOpacity 
                  style={[styles.buttonStyle1 , {height:80, width:'55%', borderWidth:4}]}
                  onPress={()=>checkId(callID)}
                  >
                  <Text style={{color:'#ececec' ,fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Join Call</Text>
              </TouchableOpacity> */}
 
              <Button 
                    style={callID ? [styles.buttonStyle1 , {height:60, width:'55%', borderWidth:3, backgroundColor:'#9366f4', borderColor:'#8152e5'}]: [styles.buttonStyle1 , {height:60, width:'55%', borderWidth:3, backgroundColor:'darkgray', borderColor:'gray'}]}
                    labelStyle={{color:'white' ,fontSize:14 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
                    icon="connection"
                    mode="contained" 
                    loading={loading}
                    disabled={callID? disable : true}
                    onPress={()=>checkId(callID)}>
                    
                        Join Call
                </Button>

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
      
      // <View style={{flex:1 , alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'white'}}>
  
      //         <Text style={{color:'#848484', fontSize:25 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Robotic End</Text>
              
      //         <TouchableOpacity 
      //             style={[styles.buttonStyle1, {height:'16%'}]}
      //             onPress={()=>{
      //               CallOptions('join')
      //               // setCallOption('join')
      //             }}
      //             >
      //             <Text style={{color:'white', fontSize:18 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Join Call</Text>
      //         </TouchableOpacity>

      //         <TouchableOpacity 
      //             style={[styles.buttonStyle1, {height:'16%'}]}
      //             onPress={()=>{
      //               CallOptions('create')
      //               // setCallOption('create')
      //             }}
      //             >
      //             <Text style={{color:'white', fontSize:18 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Create Call</Text>
      //         </TouchableOpacity>

      //         <TouchableOpacity 
      //             style={styles.buttonStyle1}
      //             onPress={()=>connect_Bt()}
      //             >
      //             <Text style={{color:'white', fontSize:18 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Connect Bluetooth</Text>
      //         </TouchableOpacity>

      //         {/* <TouchableOpacity 
      //             style={{width:'80%', height:60, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black' , backgroundColor:'lightblue'}}
      //             onPress={()=>BT_List()}
      //             >
      //             <Text style={{color:'black', fontSize:15}}>Bluetooth List</Text>
      //         </TouchableOpacity> */}

      //         {connected 
      //           &&
      //         <>
              
      //         <Text style={{color:'#373738', fontSize:15 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>
      //           Test Movements
      //         </Text>

      //         <View style={{width:'100%' , height:'8%' , flexDirection:'row' , justifyContent:'space-evenly'}}>

      //           <TouchableOpacity 
      //               style={styles.testMovement}
      //               onPressIn={()=>write_data('F')} onPressOut={()=>write_data("C")}
      //               >
      //               <Text style={{color:'#373738', fontSize:12, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>GO</Text>
      //           </TouchableOpacity>

      //           <TouchableOpacity 
      //               style={styles.testMovement}
      //               onPressIn={()=>write_data('B')} onPressOut={()=>write_data("C")}
      //               >
      //               <Text style={{color:'#373738', fontSize:12, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>BACK</Text>
      //           </TouchableOpacity>

      //         </View>

      //         <Text style={{color:'#373738', fontSize:15 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>
      //           Test Head Rotation
      //         </Text>

      //         <View style={{width:'100%' , height:'8%' , flexDirection:'row' , justifyContent:'space-evenly'}}>

      //           <TouchableOpacity 
      //               style={styles.testMovement}
      //               onPressIn={()=>write_data('a')} onPressOut={()=>write_data("c")}
      //               >
      //               <Text style={{color:'#373738', fontSize:12, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>UP</Text>
      //           </TouchableOpacity>

      //           <TouchableOpacity 
      //               style={styles.testMovement}
      //               onPressIn={()=>write_data('d')} onPressOut={()=>write_data("h")}
      //               >
      //               <Text style={{color:'#373738', fontSize:12, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>LEFT</Text>
      //           </TouchableOpacity>

      //         </View>
      //         </>}


      //         {/* <TouchableOpacity 
      //             style={{width:'60%', height:80, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black' , backgroundColor:'green'}}
      //             onPressIn={()=>write_data('F')} onPressOut={()=>write_data("C")}
      //             >
      //             <Text style={{color:'black', fontSize:15}}>Check Forward Drive</Text>
      //         </TouchableOpacity>

      //         <TouchableOpacity 
      //             style={{width:'60%', height:80, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black' , backgroundColor:'green'}}
      //             onPressIn={()=>write_data('a')} onPressOut={()=>write_data("l")}
      //             >
      //             <Text style={{color:'black', fontSize:15}}>Check Servo Angles</Text>
      //         </TouchableOpacity> */}

      // </View>
        
      <View style={{flex:1 , alignItems:'center' , justifyContent:'space-evenly'}}>

        <View style={{width:'90%' , height:connected ? '60%' : "65%", backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'darkgray', alignItems:'center', justifyContent:'space-evenly'}}>
          <View style={{flexDirection:'row'}}>
            <MIcon 
              name="robot-outline" 
              size={25} 
              color={'gray'} />
            <Text style={[styles.textStyle , {fontWeight:'bold', color:'gray', fontSize:18, marginLeft:10}]}>ROBOTIC END</Text>
          </View>
          
          <Image 
            source={require("../../Animations/RoboticEnd2.gif")}  
            style={{width:'70%', height:'50%'}}
          />

          <View style={{flexDirection:'row',width:'100%', height:'14%', justifyContent:'space-evenly'}}>
            <TouchableOpacity 
              style={[styles.buttonStyle , {height:'100%', backgroundColor:'#d53ca5', borderColor:'#c72f97', borderWidth:3, flexDirection:'row'}]} 
              onPress={()=>{CallOptions('join')}}>
                <MIcon 
                  name="call-merge" 
                  size={20} 
                  color={'white'} />
                <Text style={[styles.textStyle , {marginLeft:5}]}>Join Call</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.buttonStyle , {height:'100%', backgroundColor:'#d53ca5', borderColor:'#c72f97', borderWidth:3, flexDirection:'row'}]} 
              onPress={()=>{CallOptions('create')}}>
                <MIcon 
                  name="call-made" 
                  size={16} 
                  color={'white'} />
                <Text style={[styles.textStyle , {marginLeft:5}]}>Create Call</Text>
            </TouchableOpacity>
            
          </View>
          
        </View>

          {connected ?
               
               <View style={{width:'90%' , height:'30%' , backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'darkgray', alignItems:'center', justifyContent:'space-evenly'}}>
              
               <Text style={{color:'#373738', fontSize:15 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>
                 Test Movements
               </Text>

               <View style={{width:'100%' , height:'25%' , flexDirection:'row' , justifyContent:'space-evenly'}}>

                 <TouchableOpacity 
                     style={styles.testMovement}
                     onPressIn={()=>write_data('F')} onPressOut={()=>write_data("C")}
                     >
                     <Text style={{color:'#373738', fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>GO</Text>
                 </TouchableOpacity>

                 <TouchableOpacity 
                     style={styles.testMovement}
                     onPressIn={()=>write_data('B')} onPressOut={()=>write_data("C")}
                     >
                     <Text style={{color:'#373738', fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>BACK</Text>
                 </TouchableOpacity>

               </View>

               <Text style={{color:'#373738', fontSize:15 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>
                 Test Head Rotation
               </Text>

               <View style={{width:'100%' , height:'25%' , flexDirection:'row' , justifyContent:'space-evenly'}}>

                 <TouchableOpacity 
                     style={[styles.testMovement , {width:"40%"}]}
                     onPressIn={()=>write_data('a')} onPressOut={()=>write_data("c")}
                     >
                     <Text style={{color:'#373738', fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>UP / DOWN</Text>
                 </TouchableOpacity>

                 <TouchableOpacity 
                     style={[styles.testMovement , {width:"40%"}]}
                     onPressIn={()=>write_data('d')} onPressOut={()=>write_data("h")}
                     >
                     <Text style={{color:'#373738', fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>LEFT / RIGHT</Text>
                 </TouchableOpacity>

               </View>
               </View>
               
              :
              // <TouchableOpacity 
              //   style={[styles.buttonStyle1 , {flexDirection:'row'}]}
              //   onPress={()=>connect_Bt()}
              //   >
              //     <MIcon 
              //       name="bluetooth" 
              //       size={25} 
              //       color={'white'} />
              //     <Button 
              //       style={{height:'100%', justifyContent:'center'}}
              //       labelStyle={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
              //       mode="Outlined" 
              //       loading={loading}
              //       disabled={disable}>
                      
              //         Connect Bluetooth
              //     </Button>
              //     {/* <Text style={{color:'white', fontSize:18 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Connect Bluetooth</Text> */}
              // </TouchableOpacity>

              <Button 
                style={styles.buttonStyle1}
                labelStyle={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
                mode="contained" 
                icon='bluetooth'
                loading={loading}
                disabled={disable}
                compact={true}
                onPress={()=>connect_Bt()}>
                  
                  CONNECT ROBOT
              </Button>
            }


      </View>
        
    }
    </View>
  );
}


const styles = StyleSheet.create({

  buttonStyle:{
    width:'45%', 
    height:'12%',
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#57bec5', 
    borderWidth:5,
    borderColor:'#14a2ab',
    borderRadius:10,
    
  },
  buttonStyle1:{
    width:'85%', 
    height:'10%', 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'lightgray', 
    borderWidth:3,
    borderColor:'darkgray',
    borderRadius:10
  }
  ,
  testMovement:{
    width:'35%', 
    height:'100%',
    alignItems:'center', 
    justifyContent:'center', 
    borderWidth:3, 
    borderStyle:'solid' , 
    borderColor:'darkgray' , 
    borderRadius:10,
    backgroundColor:'lightgray'
  },
  textStyle:{
    color:'white', 
    fontSize:14,
    fontFamily:'sans-serif-medium',
    textAlign:'center',
    fontWeight:'bold'
  },
})
