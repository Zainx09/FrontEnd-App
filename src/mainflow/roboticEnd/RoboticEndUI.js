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

import FloatingButton from '../userEnd/navigationButton/FLoatingButton';

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

  const [message , setMessage] = useState('A');

  const [y ,setY] = useState('');
  const [z ,setZ] = useState('');
  const [angle , setAngles] = useState('');

  useEffect(()=>{
    // const channel = context.channel;
    // const channel2 = context.channel2;
    if (videoCall){
      channels.channel1.subscribe('MyCommand' , (message)=>{
        handleMessage(message.data);
        
      });

      channels.channel2.subscribe('MyAngles' , (angle)=>{
        handleAngle(angle.data);
      });
    }

    

    return(()=>{
      channels.channel1.unsubscribe('MyCommand');
      channels.channel2.unsubscribe('MyAngles');
    })
  });


  
  const handleMessage=(message)=>{
    setMessage(message)
    switch(message) {
      case "LEFT IN":
        write_data('C')
        break;

      case "RIGHT IN":
        write_data('D')
        break;

      case "GO IN":
        write_data('A')
        break;

      case "BACK IN":
        write_data('B')
        break;

      case "LEFT OUT":
        write_data('Z')
        break;

      case "RIGHT OUT":
        write_data('Z')
        break;

      case "GO OUT":
        write_data('Z')
        break;

      case "BACK OUT":
        write_data('Z')
        break;

      ///////////////////////////////////////// ROTATION /////////////
      case "RIGHT IN R":
        write_data('E')
        break;

      case "LEFT IN R":
        write_data('F')
        break;

      case "GO IN R":
        write_data('G')
        break;

      case "BACK IN R":
        write_data('H')
        break;

      case "LEFT OUT R":
        write_data('Z')
        break;

      case "RIGHT OUT R":
        write_data('Z')
        break;

      case "GO OUT R":
        write_data('Z')
        break;

      case "BACK OUT R":
        write_data('Z')
        break;

      /////////////////////////////// Up Down ///////////////////

      case "UP IN":
        write_data('I')
        break;

      case "DOWN IN":
        write_data('J')
        break;

      case "UP OUT":
        write_data('Z')
        break;

      case "DOWN OUT":
        write_data('Z')
        break;

      default:
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
        write_data('z');
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
        write_data('z');
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
    setCallID('');
    if(callOption === 'create'){
      setCallOption(null);
      setVideoCall(false);
    }else{
      setCallOption(null);
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
      setCallIDJoin('')
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

  const [btConnected , setBtConnected] = useState(false);
  const [blinkIcon , setBlinkIcon] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      checkBtConnect();
      }, 500);

      return () => clearInterval(interval);
  
  }, []);

  //For icon Blinking
  useEffect(()=>{
    
    const interval = setInterval(() => {
      setBlinkIcon(!blinkIcon);
      }, 400);

      return () => clearInterval(interval);
 
  },[blinkIcon])

  async function checkBtConnect(){
    let check = await BluetoothSerial.isConnected();
    if(check){
      setBtConnected(true);
      return true;
    }else{
      setBtConnected(false);
      return false;
    }
  }


  const showToastWithGravity = (msg) => {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };
 
  //address of Robot's bluetooth 00:21:11:01:CB:B9
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

      let check = await BluetoothSerial.isConnected();

      if (check){
        setLoading(false); setDisable(false);
        setBtConnected(true);
        showToastWithGravity("Connected")
      }else{
        setLoading(false); setDisable(false);
        showToastWithGravity("Please Try Again!")
        setBtConnected(false);
      }

    }catch(err){
      setLoading(false); setDisable(false);
      setBtConnected(false);
      showToastWithGravity(err.message)
    } 
  }
  

  async function write_data(key){
    let check = await BluetoothSerial.isConnected();
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

  const theme = {
    roundness: 10,
    colors: {
      primary: '#c72f97',
    },
  };  

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
            left={<TextInput.Icon name="call-made" size={20} color={(isTextInputFocused)=> isTextInputFocused ? "#c72f97" : "gray"  }/>}
            theme={theme}
            keyboardType='numeric'
          />

          <Button 
              style={callIDJoin ? [styles.buttonStyle1 , {height:55, width:'50%', backgroundColor:'#c72f97'}]: [styles.buttonStyle1 , {height:55, width:'55%', backgroundColor:'darkgray'}]}
              labelStyle={{color:'white' ,fontSize:14 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
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
              <View style={{backgroundColor:'white'}}>
                <Text style={{color:'black' , fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold', alignSelf:'center'}}>Email: {callJoinerEmail.toUpperCase()}</Text>
              </View>
            
              <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> 

              <View style={{position:'absolute', width:'100%',  height:'100%', marginTop:'10%', alignItems:'flex-end'}}>
                <View style={{flexDirection:'row', alignItems:'center', marginRight:5}}>
                  <Text style={{color:'lightgray', fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold', marginRight:5}}>BT{!btConnected && " not"} Connected!</Text>
                    <MIcon 
                      name="moon-full" 
                      size={10} 
                      color={btConnected ? 'green' : blinkIcon ? 'red' : 'lightgray'} 
                      />
                </View>

                <View style={{width:'100%' , marginRight:10}}>
                  <FloatingButton setSensors={false} control={false} connect_BT={connect_Bt} btConnected={btConnected} checkBtConnect={checkBtConnect} isHeightBtn={false} callID={callID}/>
                </View>
              </View>

            </View>

          </View>
          
          :

          <View style={{flex:1 , justifyContent:'center', alignItems:'center'}}>

              <View style={{width:'90%', height:'50%',paddingVertical:'10%', justifyContent:'space-around', alignItems:'center', backgroundColor:'white', borderColor:'darkgray', borderWidth:1, borderRadius:10}}>
                <Text style={{color:'gray' ,fontSize:16 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Share ID With Others</Text>

                <TouchableOpacity 
                  style={{width:'90%'}}
                  onPress={() =>{
                    Clipboard.setString(callID)
                    showToastWithGravity("Copied!")
                  }}>

                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center' , borderTopWidth:2 , borderBottomWidth:2, paddingVertical:10, borderColor:'gray'}}>
                      <Text style={{width:'60%', color:'darkgray' ,fontSize:15 , fontFamily:'sans-serif-medium' , fontWeight:'bold', fontStyle:'italic', borderRightWidth:1, paddingRight:10, marginRight:10}}>ID :   {callID}</Text>
                      <MIcon 
                        name="content-copy" 
                        size={25} 
                        color={'gray'} />
                    </View>
                  
                </TouchableOpacity>

                <Button 
                    style={[styles.buttonStyle1 , {height:55, width:'55%', backgroundColor:'#c72f97'}]}
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

        <View style={{width:'90%' , height:btConnected ? '60%' : "65%", backgroundColor:'white', borderWidth:2, borderRadius:10, borderColor:'lightgray', alignItems:'center', justifyContent:'space-evenly'}}>
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
                  style={[styles.buttonStyle , { backgroundColor:'#c72f97', flexDirection:'row'}]} 
                  onPress={()=>{CallOptions('join')}}>
                    <MIcon 
                      name="call-merge" 
                      size={20} 
                      color={'white'} />
                    <Text style={[styles.textStyle , {marginLeft:5}]}>Join Call</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.buttonStyle , { backgroundColor:'#c72f97', flexDirection:'row'}]} 
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

          {btConnected ?
               
               <View style={{width:'90%' , height:'35%' , backgroundColor:'white', borderWidth:2, borderRadius:10, borderColor:'lightgray', alignItems:'center', justifyContent:'space-evenly'}}>
              
                <Text style={{color:'#373738', fontSize:15 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>
                  Test Movements
                </Text>

                <View style={{width:'100%' , height:'25%' , flexDirection:'row' , justifyContent:'space-evenly'}}>

                  <TouchableOpacity 
                      style={styles.testMovement}
                      onPressIn={()=>write_data('A')} onPressOut={()=>write_data("z")}
                      >
                      <Text style={{color:'#373738', fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>GO</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                      style={styles.testMovement}
                      onPressIn={()=>write_data('B')} onPressOut={()=>write_data("z")}
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
                      onPressIn={()=>write_data('G')} onPressOut={()=>write_data("H")}
                      >
                      <Text style={{color:'#373738', fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>UP / DOWN</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                      style={[styles.testMovement , {width:"40%"}]}
                      onPressIn={()=>write_data('E')} onPressOut={()=>write_data("F")}
                      >
                      <Text style={{color:'#373738', fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>LEFT / RIGHT</Text>
                  </TouchableOpacity>

                </View>
               </View>
               
              :

              <Button 
                style={{width:'65%', height:60, backgroundColor:'darkgray', borderRadius:10, flexDirection:'row', alignItems:'center' , justifyContent:'center'}} 
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
    width:'44%', 
    height:55,
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#57bec5', 
    borderRadius:5,
    
  },
  buttonStyle1:{
    width:'85%', 
    height:'10%', 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'lightgray', 
    borderRadius:5
  }
  ,
  testMovement:{
    width:'35%', 
    height:55,
    alignItems:'center', 
    justifyContent:'center', 
    borderRadius:5,
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
