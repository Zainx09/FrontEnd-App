import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications


import 'react-native-gesture-handler';

import React from 'react';
import { useState , useEffect, useContext} from 'react';
import { StyleSheet, Text, View , TouchableOpacity , Dimensions, BackHandler, Alert, Clipboard, ToastAndroid, Image, ActivityIndicator} from 'react-native';
import {StackActions} from '@react-navigation/native';
import Pusher from 'pusher-js/react-native';

import pusherConfig from '../pusher.json';
import AgoraUIKit from 'agora-rn-uikit';
import agoraConfig from "./AgorarChannels.json"

import Api from '../../api/Api'

import Icon from 'react-native-vector-icons/FontAwesome5';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import BluetoothSerial from 'react-native-bluetooth-serial-2'

import NavigationButtons from './navigationButton/NavigationButtons';
import HeightButtons from './navigationButton/HeightButton';
import FloatingButton from './navigationButton/FLoatingButton';

import { setUpdateIntervalForType, SensorTypes, accelerometer ,gyroscope, orientation  } from "react-native-sensors";

import Ably from "ably";

//RN Paper
import { TextInput, Button } from 'react-native-paper';

//varification code field
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 5;

import { AllContext } from '../../../App';

// const ably = new Ably.Realtime('4WmoOg.4SZS1g:w84M-soVmVHhJSbjdeEryB9MYYMIQ3WZSJVnEdMOsu4');
// const channel = ably.channels.get('ABLY');
// const channel2 = ably.channels.get('ABLY2');

const windowHeight = Dimensions.get('window').height;

const VideoCallHeight = windowHeight*(70/100);
const buttonsHeight = windowHeight*(30/100);



export default function VideoCallScreenWithControlls({ route, navigation }){

    //useContext for user data
    const {UserData} = useContext(AllContext);
    const [userData, setUserData] = UserData;

    //for Button
    const [loading , setLoading] = useState(false);
    const [disable , setDisable] = useState(false);

    const {control} = route.params;
    // const control = true;
    

    const showToastWithGravity = (msg) => {
      ToastAndroid.showWithGravity(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    };

    
    ////////////////// ABLY API ///////////////////////////

    const {channels} = useContext(AllContext);


    ///// For Navigations
    const onSendMessage=(text)=>{
      // showToastWithGravity(text)
      channels.channel1.publish('MyCommand', text);
      return;
    }


      ////// For Angles
      const sendAngle=(text)=>{ 
        channels.channel2.publish('MyAngles', text);
        return;
    }

    ////////////////// ABLY API ///////////////////////////


    ///////////////// Video Call //////////////////////
    const [callOption , setCallOption] = useState(''); //////////////////////////////
    const [callID , setCallID] = useState('')
    const [callIDJoin , setCallIDJoin] = useState('')
    const [videoCall, setVideoCall] = useState(false); ///////////////////////////

    const [createCallLoader , setCreateCallLoader] = useState(false)

    const [rtcProps, setRtcProps] = useState({})

    const [ callJoinerEmail , setCallJoinerEmail ] = useState('')

    const [value, setValue] = useState('');

    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props2, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    async function CallOptions(option){
      

      if(option === 'join'){
        setCallOption(option)
        setRtcProps({
          appId: agoraConfig.appId2,
          token: agoraConfig.token2,
          channel: agoraConfig.channelName2
        })

      }else if(option === 'create'){    
        
        setRtcProps({
          appId: agoraConfig.appId,
          token: agoraConfig.token,
          channel: agoraConfig.channelName
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

          const response = await Api.post('/callLog' , { "email":userData.email , "username":userData.username , "type":option , "callJoinId" : "" , "channelName" : agoraConfig.channelName, "today" : today });

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
      setCallIDJoin('')
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

        const response = await Api.post('/callLog' , { "email":userData.email , "username":userData.username, "type":'join' , "callJoinId" : Id , "channelName" : agoraConfig.channelName2 , "today" : today});
  
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
              setCallIDJoin('');
              setCallOption(null);
              setVideoCall(false);
            }
          }}
          
        ]);
        return true;
      }else if(callOption != null){
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


    ///////////////// Sensor readings //////////////////////
    const [data, setData] = useState({'roll':null , 'yaw':null});

    const [isSensors , setIsSensors] = useState(true);

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
      if(control && isSensors){
        setUpdateIntervalForType(SensorTypes.orientation  ,500);
      }
    },[control , isSensors]);

    

    useEffect(() => {

      if(control && isSensors){
        let device_motion;
        try{
          device_motion = orientation.subscribe(({qx, qy, qz, qw, pitch, roll, yaw}) =>{
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

        }catch(err){
          console.log(err);
        }
        

        return(()=>{
          try{
            device_motion.unsubscribe();
          }catch(err){
            console.log(err)
          }
        })
      }

    }, [data , control , isSensors]);

    ///////////////// Sensor readings //////////////////////


    ////////////////// Bluetooth Code ////////////////////

    const [btConnected , setBtConnected] = useState(false);
    const [blinkIcon , setBlinkIcon] = useState(false);

    let navigate = '';
    const [nav , setNav] = useState('')

    useEffect(() => {
      if(!control){
        const interval = setInterval(() => {
          checkBtConnect();
          readData();
          }, 300);

          return () => clearInterval(interval);
      }   
    }, []);


    //For icon Blinking
    useEffect(()=>{
      if(!control){
        const interval = setInterval(() => {
          setBlinkIcon(!blinkIcon);
          }, 400);
    
          return () => clearInterval(interval);
      }
      
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


    //address of joystick's bluetooth 00:18:E4:40:00:06
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
        await BluetoothSerial.connect("00:18:E4:40:00:06");

        setLoading(false); setDisable(false);

        let check = await BluetoothSerial.isConnected();

        if (check){
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

    async function readData(){
      let check = await BluetoothSerial.isConnected();
      if (!check) {
        return false
      }
      
      try{
        let data = ''
        data = await BluetoothSerial.readFromDevice();

        if(data){

          switch(String(data)){

            case 'A':
              if(navigate != 'A'){
                console.log('A');
                navigate = 'A';
                onSendMessage('GO IN');
              }
              break;
      
            case "B":
              if(navigate != 'B'){
                console.log('B');
                navigate = 'B';
                onSendMessage('BACK IN');
              }
              break;
      
            case "C":
              if(navigate != 'C'){
                console.log('C');
                navigate = 'C';
                onSendMessage('LEFT IN');
              }
              break;

            case "D":
              if(navigate != 'D'){
                console.log('D');
                navigate = 'D';
                onSendMessage('RIGHT IN');
              }
              break;

            case 'E':
              if(navigate != 'E'){
                console.log('E');
                navigate = 'E';
                onSendMessage('LEFT IN R');
              }
              break;
      
            case "F":
              if(navigate != 'F'){
                console.log('F');
                navigate = 'F';
                onSendMessage('RIGHT IN R');
              }
              break;
      
            case "G":
              if(navigate != 'G'){
                console.log('G');
                navigate = 'G';
                onSendMessage('BACK IN R');
              }
              break;

            case "H":
              if(navigate != 'H'){
                console.log('H');
                navigate = 'H';
                onSendMessage('GO IN R');
              }
              break;

            default:
              navigate = 'Z';
              onSendMessage('GO OUT');
              console.log('Z');
              break
            }
        }
        
      }catch(err){
        setBtConnected(false);
        showToastWithGravity(err.message);
      }
      
    }

    const theme = {
      roundness: 10,
      colors: {
        primary: '#9366f4',
      },
    };   
    
    return(

      <View style={{flex:1}}> 

      {callOption ? 
        
        callOption==='join' && !videoCall ? 
          <View style={{flex:1 , justifyContent:'center' ,alignItems:'center',  backgroundColor:'#7C56C3', borderWidth:2}}>
            
            <Text style={styles.title}>Enter Call ID here</Text>

            <CodeField
              ref={ref}
              {...props2}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={callIDJoin}
              onChangeText={setCallIDJoin}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
              <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
              )}
            />

            <Button 
                style={callIDJoin.length === 5 ? [styles.buttonStyle1 , {height:55, width:'55%', backgroundColor:'#D5B326'}]: [styles.buttonStyle1 , {height:55, width:'55%', backgroundColor:'darkgray'}]}
                labelStyle={{color:'white' ,fontSize:16, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
                icon="connection"
                mode="contained" 
                loading={loading}
                disabled={callIDJoin.length === 5 ? disable : true}
                uppercase={false}
                onPress={()=>checkId(callIDJoin)}>
                
                    Join Call
            </Button>

          </View>

          :

          videoCall ? 

            control? 
              <View style={{flex:1, backgroundColor:'black'}}>
                  <View style={{height:'82%'}}>
                    <View style={{backgroundColor:'white'}}>
                      <Text style={{color:'black' , fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold', alignSelf:'center'}}>Email : {callJoinerEmail.toUpperCase()}</Text>
                    </View>
                    <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> 
                    
                    <View style={{position:'absolute', width:'100%',  height:'100%', marginTop:'10%', alignItems:'flex-end'}}>
                      {isSensors && 
                        <View style={{width:65, height:60 , marginRight:5, flexDirection:'column', alignItems:'center'}}>
                          <Text style={{height:'50%' , color:'lightgray' ,fontSize:11 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>X: {data.yaw}</Text>
                          <Text style={{height:'50%' , color:'lightgray' ,fontSize:11 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Y: {data.roll}</Text>
                        </View>
                      }
                      <View style={{width:'100%' , marginRight:10}}>
                        <FloatingButton setSensors={setIsSensors} control={control} isHeightBtn={false} callID={callID}/>
                      </View>
                    </View>
                    

                  </View>

                  <View style={{height:'18%', flexDirection:'row' , justifyContent:'space-around', backgroundColor:"lightgray", borderWidth:2 , borderColor:'gray' , borderTopRightRadius:30, borderTopLeftRadius:30, marginHorizontal:5}}>
                    {!isSensors && 
                      <View style={{height:'100%', width:'40%' , borderColor:'darkgray'}}>
                          <NavigationButtons onSendMessage={ onSendMessage } type={"rotation"}/>
                      </View>
                    }

                    <View style={{height:'100%', width:'13%', paddingVertical:3}}>
                      <HeightButtons onSendMessage={ onSendMessage }/>
                    </View>

                    <View style={{height:'100%', width:'40%' , borderColor:'darkgray'}}>
                        <NavigationButtons onSendMessage={ onSendMessage } type="navigation"/>
                    </View>
                  </View>
  
              </View>
            :
              <View style={{marginBottom:20}}>
                <View style={{backgroundColor:'white'}}>
                  <Text style={{color:'black' , fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold', alignSelf:'center'}}>Email: {callJoinerEmail.toUpperCase()}</Text>
                </View>
                <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> 

                <View style={{position:'absolute', width:'100%',  height:'100%', marginTop:40, alignItems:'flex-end'}}>
                  <View style={{flexDirection:'row', alignItems:'center', marginRight:5}}>
                    <Text style={{color:'lightgray', fontSize:11, fontFamily:'sans-serif-medium' , fontWeight:'bold', marginRight:5}}>BT{!btConnected && " not"} Connected!</Text>
                      <MIcon 
                        name="moon-full" 
                        size={10} 
                        color={btConnected ? 'green' : blinkIcon ? 'red' : 'lightgray'} 
                        />
                  </View>

                  <View style={{width:'100%', marginRight:10}}>
                    <FloatingButton setSensors={setIsSensors} control={control} connect_BT={connect_Bt} btConnected={btConnected} checkBtConnect={checkBtConnect} isHeightBtn={true} onSendMessage={ onSendMessage } callID={callID}/>
                  </View>
                </View>
              </View>
          :

            <View style={{flex:1 , justifyContent:'center', alignItems:'center', backgroundColor:'#8F6CD1'}}>
              <Text style={{color:'#e5be1a' ,fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold' , marginBottom:20}}>Share ID With Others</Text>
              
              <View style={{width:'90%', height:'35%',paddingVertical:'10%', justifyContent:'space-around', alignItems:'center', backgroundColor:'white', borderColor:'gray', borderWidth:2, borderRadius:20}}>
           
                <TouchableOpacity 
                  style={{width:'70%'}}
                  onPress={() =>{
                    Clipboard.setString(callID)
                    showToastWithGravity("Copied!")
                  }}>

                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', borderTopWidth:2 , borderBottomWidth:2, paddingVertical:10, borderColor:'gray'}}>
                      <Text style={{width:'60%', color:'darkgray' ,fontSize:15 , fontFamily:'sans-serif-medium' , fontWeight:'bold', fontStyle:'italic', borderRightWidth:1, paddingRight:10, marginRight:10}}>ID :   {callID}</Text>
                      <MIcon 
                        name="content-copy" 
                        size={25} 
                        color={'gray'} />
                    </View>
                  
                </TouchableOpacity>

                <Button 
                    style={[styles.buttonStyle1 , {height:60, width:'60%', backgroundColor:'#673ab7', borderColor:'#8152e5', borderRadius:5}]}
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
        
        <View style={{flex:1, alignItems:'center', justifyContent:'space-evenly', backgroundColor:'#8F6CD1'}}> 

          <View style={{width:'90%' , height:'70%' , backgroundColor:'white', borderWidth:2, borderRadius:30, borderColor:'gray', alignItems:'center', justifyContent:'space-around'}}>

            <Text style={[styles.textStyle , {fontWeight:'bold', color:'gray', fontSize:18, marginLeft:10}]}>{control ? "With Navigation" : "Without Navigation"}</Text>
            
            <Image 
              source={control ? require("../../Animations/withNavigation.gif") : require("../../Animations/withoutNavigation.gif")}  
              style={control ? {width:'40%', height:'30%'} : {width:'60%', height:'50%'}}
            />

            <View style={{flexDirection:'column', width:'100%', height:'30%', justifyContent:'space-evenly', alignItems:'center'}}>

              {createCallLoader ? <ActivityIndicator size="large" color="#a88ed6" /> :
           
              <>
                <TouchableOpacity 
                  style={[styles.buttonStyle , { backgroundColor:'#673ab7', flexDirection:'row'}]} 
                  onPress={()=>{CallOptions('join')}}>
                    <MIcon 
                      name="call-merge" 
                      size={20} 
                      color={'white'} />
                    <Text style={[styles.textStyle , {marginLeft:5}]}>Join Call</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.buttonStyle , { backgroundColor:'#673ab7', flexDirection:'row'}]} 
                  onPress={()=>{CallOptions('create')}}>
                    <MIcon 
                      name="call-made" 
                      size={20} 
                      color={'white'} />
                    <Text style={[styles.textStyle , {marginLeft:5}]}>Create Call</Text>
              </TouchableOpacity>
              </>
            }
              
            </View>
            
          </View>

          {!control && 

             <Button 
              style={{width:'70%', height:60, backgroundColor:'#D5B326', borderRadius:10, flexDirection:'row', alignItems:'center' , justifyContent:'center'}} 
              labelStyle={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
              uppercase={false}
              mode="contained" 
              icon='bluetooth'
              loading={loading}
              disabled={disable}
              onPress={()=>connect_Bt()}>
                
                Connect Controller
            </Button>
          }
        </View>

      }
      
    </View>
        
  )
}


const styles = StyleSheet.create({

  buttonStyle:{
    width:'85%', 
    height:'40%',
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#57bec5', 
    borderRadius:5, 
  },
  buttonStyle1:{
    width:'85%', 
    height:'12%', 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#a3c0e5', 
    borderRadius:5
  },
  textStyle:{
    color:'white', 
    fontSize:14,
    fontFamily:'sans-serif-medium',
    textAlign:'center',
    fontWeight:'bold'
  },
  title: {
    textAlign: 'center', 
    fontSize: 20,
    width:'90%',
    color:'#e5be1a', 
    fontFamily:'sans-serif-medium', 
    fontWeight:'bold',
    marginBottom:'15%'
  },
  codeFieldRoot: {
      marginBottom: '15%',
      width:'70%'
  },
  cell: {
    width: 40,
    height: 40,
    fontSize: 25,
    borderWidth:2,
    borderColor: 'lightgray',
    textAlign: 'center',
    color:'#FFF',
    fontWeight:'bold'
  },
  focusCell: {
    borderColor: '#e5be1a',
  },
})

function getAngle(type , angle){

    if(type === 'roll'){
      if(angle < 25){
        return 5
      }
      else if(angle >= 25 && angle < 65){
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