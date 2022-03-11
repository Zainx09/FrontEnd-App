import 'react-native-gesture-handler';

import React from 'react';
import { useState , useEffect} from 'react';
import { StyleSheet, Text, View , TouchableOpacity , Dimensions , ToastAndroid} from 'react-native';
import Pusher from 'pusher-js/react-native';

import pusherConfig from '../pusher.json';
import AgoraUIKit from 'agora-rn-uikit';

import BluetoothSerial from 'react-native-bluetooth-serial-2'

import Ably from "ably";

const ably = new Ably.Realtime('4WmoOg.4SZS1g:w84M-soVmVHhJSbjdeEryB9MYYMIQ3WZSJVnEdMOsu4');
const channel = ably.channels.get('ABLY'); // for movement
const channel2 = ably.channels.get('ABLY2'); // for angles
const channel3 = ably.channels.get('ABLY3'); // for joystick


const windowHeight = Dimensions.get('window').height;

const VideoCallHeight = windowHeight*(80/100);
const buttonsHeight = windowHeight*(20/100);

export default function VideoCallScreen({navigation}){

    ///////////////// Video Call //////////////////////
    const [callOption , setCallOption] = useState(null);
    const [callID , setCallID] = useState('')
    const [videoCall, setVideoCall] = useState(false);
    const rtcProps = {
        appId: '72c2e0389a9e4beabcddc99e0d15a9d1',
        token:'00672c2e0389a9e4beabcddc99e0d15a9d1IAC7zxeamP6oby+HLvHX/OmiBS00vydqNpcoCvDkeSJGOkOQEggAAAAAEACjt5mRq20mYgEAAQCpbSZi',
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


  ////////////////// ABLY API ///////////////////////////

//   const [message , setMessage] = useState('');

//   const [y ,setY] = useState('');
//   const [z ,setZ] = useState('');
//   const [angle , setAngles] = useState('');

//   useEffect(()=>{

//     channel.subscribe('MyCommand' , (message)=>{
//       handleMessage(message.data)
//     });

//     channel2.subscribe('MyAngles' , (angle)=>{
//       handleAngle(angle.data)
//     });

//     return(()=>{
//       channel.unsubscribe('MyCommand');
//       channel2.unsubscribe('MyAngles');
//     })
//   },[]);

//   const handleMessage=(message)=>{
//     setMessage(message)
//     switch(message) {
//       case "LEFT IN":
//         write_data('L')
//         break;

//       case "RIGHT IN":
//         write_data('R')
//         break;

//       case "GO IN":
//         write_data('F')
//         break;

//       case "BACK IN":
//         write_data('B')
//         break;

//       case "LEFT OUT":
//         write_data('C')
//         break;

//       case "RIGHT OUT":
//         write_data('C')
//         break;

//       case "GO OUT":
//         write_data('C')
//         break;

//       case "BACK OUT":
//         write_data('C')
//         break;

//       default:
//         // write_data('C');
//         break
//     }
//     // write_data()
    
//   } 

//   // z axis = 18 letters.
//   // y axis = 12 letters.
//   const handleAngle=(angle)=>{
    
//     setY(angle.split(" ")[0]);
//     setZ(angle.split(" ")[1]);
//     // setAngles(angle)

//     switch(angle.split(" ")[0]) {
//       case "25":
//         write_data('a')
//         break;

//       case "35":
//         write_data('b')
//         break;

//       case "45":
//         write_data('c')
//         break;

//       case "55":
//         write_data('d')
//         break;

//       case "65":
//         write_data('e')
//         break;

//       case "75":
//         write_data('f')
//         break;

//       case "85":
//         write_data('g')
//         break;

//       case "95":
//         write_data('h')
//         break;

//       case "105":
//         write_data('i')
//         break;
    
//       case "115":
//         write_data('j')
//         break;

//       case "125":
//         write_data('k')
//         break;

//       case "135":
//         write_data('l')
//         break;

//       default:
//         // write_data('C');
//         break
//       }
//   }


  ////////////////// ABLY API ///////////////////////////



  ////////////////// Bluetooth Code ////////////////////

  const [connected , setConnected] = useState(false);
  const [ navigate , setNavigate ] = useState('');
//   const [y ,setY] = useState('');
//   const [z ,setZ] = useState('');


    useEffect(() => {
        const interval = setInterval(() => {
        sendData();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const sendData = ()=> {
    // console.log('Sending data')
    }
 

  const showToastWithGravity = (msg) => {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
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
  

  async function write_data(key){
    let check = BluetoothSerial.isConnected();
    if (!check) {
      // showToastWithGravity("Must be connected!!");
      console.log("Must be connected!!");
      return
    }else{

      try{
        await BluetoothSerial.write(key);
        // console.log("Writed");
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







    return(
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
          <View style={{flex:1 , flexDirection:'column'}}>
            <View style={{height:'12%' , backgroundColor:'white'}}>
              {/* <Text style={{color:'black'}}> {messages.message} </Text> */}
              <Text style={{color:'black'}}>{navigate} </Text>
            </View>
            <View style={{height:'88%'}}>
              <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> 
            </View>
          </View>
          
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
                  style={{width:'80%', height:60, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
                  onPress={()=>setCallOption('join')}
                  >
                  <Text style={{color:'black', fontSize:15}}>Join Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                  style={{width:'80%', height:60, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
                  onPress={()=>setCallOption('create')}
                  >
                  <Text style={{color:'black', fontSize:15}}>Create Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                  style={{width:'80%', height:60, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black' , backgroundColor:'lightblue'}}
                  onPress={()=>connect_Bt()}
                  >
                  <Text style={{color:'black', fontSize:15}}>Connect Controller</Text>
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
      </View>
        
    }
    </View>
        
    )
}