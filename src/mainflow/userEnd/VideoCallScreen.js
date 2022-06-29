import 'react-native-gesture-handler';

import React from 'react';
import { useState , useEffect, useContext} from 'react';
import { StyleSheet, Text, View , TouchableOpacity , TextInput, Dimensions , ToastAndroid, Clipboard, BackHandler, Alert} from 'react-native';
import {StackActions} from '@react-navigation/native';

import Pusher from 'pusher-js/react-native';

import pusherConfig from '../pusher.json';
import AgoraUIKit from 'agora-rn-uikit';
import agoraConfig from "./AgorarChannels.json"

import BluetoothSerial from 'react-native-bluetooth-serial-2'

import Ably from "ably";

import { ChannelContext } from '../../../App';

// const ably = new Ably.Realtime('4WmoOg.4SZS1g:w84M-soVmVHhJSbjdeEryB9MYYMIQ3WZSJVnEdMOsu4');
// const channel = ably.channels.get('ABLY'); // for movement
// const channel2 = ably.channels.get('ABLY2'); // for angles
// const channel3 = ably.channels.get('ABLY3'); // for joystick


const windowHeight = Dimensions.get('window').height;

const VideoCallHeight = windowHeight*(80/100);
const buttonsHeight = windowHeight*(20/100);

export default function VideoCallScreen({navigation}){

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
      return false;
        
    };
  
  
    useEffect(() => {
      
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
      
      
  
      return () => backHandler.remove();
    }, [videoCall]);

  ///////////////// Video Call //////////////////////



  ////////////////// Bluetooth Code ////////////////////

  const [connected , setConnected] = useState(false);

  // const [navigate , setNavigate] = useState('');

  let navigate = '';


  useEffect(() => {
      const interval = setInterval(() => {
      readData();
      }, 500);
      return () => clearInterval(interval);
  }, []);

    
 

  const showToastWithGravity = (msg) => {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };

  //address of joystick's bluetooth 00:18:E4:40:00:06
 
  async function connect_Bt(){
    try{
      let en = await BluetoothSerial.isEnabled();

      if(!en){
        showToastWithGravity("Please Enable Bluetooth.")
        // console.log("Please Enable Bluetooth.")
        return
      }

      await BluetoothSerial.connect("00:18:E4:40:00:06");

      let check = BluetoothSerial.isConnected();

      if (check){
        setConnected(true);
        showToastWithGravity("Connected")
        // console.log('Connected')
        
      }else{
        showToastWithGravity("Something Went Wrong")
        setConnected(false);
      }
      
    }catch(err){
      setConnected(false);
      showToastWithGravity(err.message)
      // console.log('Error ------ ' , err)
      
    }
    
  }

  async function readData(){
    // let check = BluetoothSerial.isConnected();
    if (!BluetoothSerial.isConnected()) {
      showToastWithGravity("Must be connected!!");
      return
    }
    
    let data = await BluetoothSerial.readFromDevice();

    try{
      let data = await BluetoothSerial.readFromDevice();

      if(data){
      
        if(data == 'F'){
          if(navigate !== 'F'){
            console.log(data);
            navigate = 'F';
            onSendMessage('GO IN');
          }

        }else if (data == 'B'){
          if(navigate !== 'B'){
            console.log(data);
            navigate = 'B';
            onSendMessage('BACK IN');
          }

        }else if (data == 'L'){
          if(navigate !== 'L'){
            console.log(data);
            navigate = 'L'
            onSendMessage('LEFT IN');
          }
          
        }else if (data == 'R'){
          if(navigate !== 'R'){
            console.log(data);
            navigate = 'R'
            onSendMessage('RIGHT IN');
          }
          
        }else if (data == 'C'){
          if(navigate !== 'C'){
            console.log(data);
            navigate = 'C'
            onSendMessage('GO OUT');
          }
          
        }
      }
      
    }catch(err){
      setConnected(false);
      // showToastWithGravity(err.message);
      console.log(err.message)
    }
    
    }

  ////////////////// Bluetooth Code ////////////////////


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
            <View>
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
      
      <View style={{flex:1, alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'white'}}>

              <Text style={{color:'#848484', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Without Navigation</Text>

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

              <TouchableOpacity 
                  style={[styles.buttonStyle , {height:'14%'}]}
                  onPress={()=>connect_Bt()}
                  >
                  <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Connect Controller</Text>
              </TouchableOpacity>



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
  }
})
