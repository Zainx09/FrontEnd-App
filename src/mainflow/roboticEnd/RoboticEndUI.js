import 'react-native-gesture-handler';
import { useState , useEffect, useContext} from 'react';
import React from 'react';
import Pusher from 'pusher-js/react-native';
import { StyleSheet, Text, View , TouchableOpacity , ToastAndroid, Clipboard, BackHandler, Alert, Image, ActivityIndicator} from 'react-native';
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

import Api from '../../api/Api'

import pusherConfig from '../pusher.json';

import BluetoothSerial from 'react-native-bluetooth-serial-2'

import Ably from "ably";

import { AllContext } from '../../../App';

// const ably = new Ably.Realtime('4WmoOg.4SZS1g:w84M-soVmVHhJSbjdeEryB9MYYMIQ3WZSJVnEdMOsu4');
// const channel = ably.channels.get('ABLY'); // for movement
// const channel2 = ably.channels.get('ABLY2'); // for angles


export default function RoboticEndUI({navigation}){

  //useContext for user data
  const {UserData} = useContext(AllContext);
  const [userData, setUserData] = UserData;

  //for Button
  const [loading , setLoading] = useState(false);
  const [disable , setDisable] = useState(false);
  

  ////////////////// ABLY API ///////////////////////////

  const {channels} = useContext(AllContext);

  const [message , setMessage] = useState('');

  const [y ,setY] = useState('');
  const [z ,setZ] = useState('');
  const [angle , setAngles] = useState('');

  useEffect(()=>{
    // const channel = context.channel;
    // const channel2 = context.channel2;

    channels.channel1.subscribe('MyCommand' , (message)=>{
      handleMessage(message.data)
    });

    channels.channel2.subscribe('MyAngles' , (angle)=>{
      handleAngle(angle.data)
    });

    return(()=>{
      channels.channel1.unsubscribe('MyCommand');
      channels.channel2.unsubscribe('MyAngles');
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
  const [callIDJoin , setCallIDJoin] = useState('')
  const [videoCall, setVideoCall] = useState(false);

  const [createCallLoader , setCreateCallLoader] = useState(false)

  const [rtcProps, setRtcProps] = useState({})

  const [ callJoinerEmail , setCallJoinerEmail ] = useState('')

  // let rtcProps = {};

  async function CallOptions(option){
    

    if(option === 'join'){
      setRtcProps({
        appId: agoraConfig.appId,
        token: agoraConfig.token,
        channel: agoraConfig.channelName
      })
      setCallOption(option)

    }else if(option === 'create'){

      setRtcProps({
        appId: agoraConfig.appId2,
        token: agoraConfig.token2,
        channel: agoraConfig.channelName2
      })

      try{

        let today = new Date();

        let dd = today.getDate();
        let mm = today.getMonth()+1; 
        let yyyy = today.getFullYear();

        if(dd<10){
            dd='0'+dd;
        } 

        if(mm<10){
            mm='0'+mm;
        } 

        let hr = today.getHours();
        let min = today.getMinutes();

        if (min < 10){
            min = "0" + min;
        }

        var ampm = "am";
        if( hr > 12 ){
            hr -= 12;
            ampm = "pm";
        }
        if( hr === 0 ){
          hr = 12;
        }

        today = dd+'-'+mm+'-'+yyyy+" "+hr+":"+min+""+ampm;

        setCreateCallLoader(true);

        const response = await Api.post('/callLog' , { "email":userData.email , "username":userData.username , "type":option , "callJoinId" : "" , "channelName" : agoraConfig.channelName2, "today" : today });

        if(response.data){
          setCallID( response.data.CallId );
          setCreateCallLoader(false);
          setCallOption(option)
        }else{
          setCreateCallLoader(false);
          showToastWithGravity("Not Responding")
        }

      }catch(err){
        setCreateCallLoader(false);
        showToastWithGravity("Can't create call")
      }
    }
  }

  const callbacks = {EndCall: () => {

    if(callOption === 'create'){
      setCallOption(null);
      setVideoCall(false);
    }else{
      setVideoCall(false);
    }
  }};


  async function checkId(Id){
    setLoading(true)
    try{

      let today = new Date();

      let dd = today.getDate();
      let mm = today.getMonth()+1; 
      let yyyy = today.getFullYear();

      if(dd<10){
          dd='0'+dd;
      } 

      if(mm<10){
          mm='0'+mm;
      } 

      let hr = today.getHours();
      let min = today.getMinutes();

      if (min < 10){
          min = "0" + min;
      }

      var ampm = "am";
      if( hr > 12 ){
          hr -= 12;
          ampm = "pm";
      }
      if( hr === 0 ){
        hr = 12;
      }

      today = dd+'-'+mm+'-'+yyyy+" "+hr+":"+min+""+ampm;

      const response = await Api.post('/callLog' , { "email":userData.email , "username":userData.username, "type":'join' , "callJoinId" : Id , "channelName" : agoraConfig.channelName , "today" : today});


      if(response.data){
        setCallJoinerEmail(response.data.CreatorEmail)
        setLoading(false)
        setVideoCall(true);
      }else{
        setLoading(false)
        showToastWithGravity("Invalid Call Id")
      }

    }catch(err){
      setLoading(false)
      showToastWithGravity("Can't join call")
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

          if(callOption === 'create'){
            setCallOption(null);
            setVideoCall(false);
          }else{
            setVideoCall(false);
          }
          
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

    if(videoCall && callOption == 'join'){

      channels.channel4.publish('callJoinerEmail', userData.email);

    }else if(videoCall && callOption == 'create'){

      channels.channel4.subscribe('callJoinerEmail' , (email)=>{
        setCallJoinerEmail(email.data)
      });
    }

    return () => {
      backHandler.remove();
      if(videoCall && callOption == 'create'){
        channels.channel4.unsubscribe('callJoinerEmail');
      }
    }
  }, [videoCall, callOption]);

  ///////////////// Video Call //////////////////////





  ////////////////// Bluetooth Code ////////////////////

  const [connected , setConnected] = useState(false);


  const showToastWithGravity = (msg) => {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
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

    <View style={{flex:1}}> 

    {callOption ? 
      
      callOption==='join' && !videoCall ? 
        <View style={{flex:1 , justifyContent:'center' ,alignItems:'center',  backgroundColor:'white'}}>
          
              <TextInput
                style={{width:'85%',fontSize:13 , fontFamily:'sans-serif-medium' , fontWeight:'bold', marginBottom:20}}
                placeholder="Type Call ID Here"
                placeholderTextColor = 'lightgray'
                onChangeText={(text)=>{setCallIDJoin(text)}}
                mode="outlined"
                label="Call ID"
                left={<TextInput.Icon name="call-made" size={20} color="#9366f4"/>}
              />
              <Button 
                  style={callIDJoin ? [styles.buttonStyle1 , {height:60, width:'55%', borderWidth:3, backgroundColor:'#9366f4', borderColor:'#8152e5'}]: [styles.buttonStyle1 , {height:60, width:'55%', borderWidth:3, backgroundColor:'darkgray', borderColor:'gray'}]}
                  labelStyle={{color:'white' ,fontSize:13 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
                  icon="connection"
                  mode="contained" 
                  loading={loading}
                  disabled={callIDJoin? disable : true}
                  uppercase={false}
                  onPress={()=>checkId(callIDJoin)}>
                  
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
              <View style={{backgroundColor:'black'}}>
                <Text style={{color:'white' , fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold', alignSelf:'center'}}>{callJoinerEmail.toUpperCase()}</Text>
              </View>
            
              <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> 
            </View>
          </View>
          
          :

          <View style={{flex:1 , justifyContent:'center', alignItems:'center'}}>

              <View style={{width:'90%', height:'50%',paddingVertical:'10%', justifyContent:'space-around', alignItems:'center', backgroundColor:'white', borderColor:'darkgray', borderWidth:3, borderRadius:20}}>
                <Text style={{color:'gray' ,fontSize:16 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Share ID With Others</Text>

                <TouchableOpacity 
                  style={{width:'90%'}}
                  onPress={() =>{
                    Clipboard.setString(callID)
                    showToastWithGravity("Copied!")
                  }}>

                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center' , borderTopWidth:2 , borderBottomWidth:2, paddingVertical:5, borderColor:'gray'}}>
                    <Text style={{width:'60%', color:'darkgray' ,fontSize:15 , fontFamily:'sans-serif-medium' , fontWeight:'bold', fontStyle:'italic', borderRightWidth:1, paddingRight:10, marginRight:10}}>ID :   {callID}</Text>
                      <MIcon 
                        name="content-copy" 
                        size={25} 
                        color={'gray'} />
                    </View>
                  
                </TouchableOpacity>

                <Button 
                    style={[styles.buttonStyle1 , {height:60, width:'55%', borderWidth:3, backgroundColor:'#d53ca5', borderColor:'#c72f97', borderRadius:10}]}
                    labelStyle={{color:'white' ,fontSize:14 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
                    icon="call-made"
                    mode="contained" 
                    uppercase={false}
                    onPress={()=>setVideoCall(true)}>
                    
                        Start Call
                </Button>
              </View>
            </View>
    
      :
        
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

          <View style={{flexDirection:'row',width:'100%', height:55, justifyContent:'space-evenly'}}>
            
            {createCallLoader ? <ActivityIndicator size="large" color="#d53ca5" /> :
           
              <>
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
              </>
            }

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

              // <Button 
              //   style={styles.buttonStyle1}
              //   labelStyle={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
              //   mode="contained" 
              //   icon='bluetooth'
              //   loading={loading}
              //   disabled={disable}
              //   compact={true}
              //   onPress={()=>connect_Bt()}>
                  
              //     CONNECT ROBOT
              // </Button>

              <Button 
              style={{width:'75%', height:'10%', backgroundColor:'darkgray', borderColor:'gray', borderWidth:3, borderRadius:10, flexDirection:'row', alignItems:'center' , justifyContent:'center'}} 
              labelStyle={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
              uppercase={false}
              mode="contained" 
              icon='bluetooth'
              loading={loading}
              disabled={disable}
              onPress={()=>connect_Bt()}>
                
                Connect Robot
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
