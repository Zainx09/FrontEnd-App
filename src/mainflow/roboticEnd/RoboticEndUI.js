import 'react-native-gesture-handler';
import { useState , useEffect} from 'react';
import React from 'react';
import Pusher from 'pusher-js/react-native';
import { StyleSheet, Text, View , TouchableOpacity , TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AgoraUIKit from 'agora-rn-uikit';

import pusherConfig from '../pusher.json';


export default function RoboticEndUI(){

  
  const [messages , setMessages] = useState('')


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




  ///////////////// Pusher API /////////////////////////
  useEffect(() => {
    const pusher = new Pusher(pusherConfig.key, pusherConfig); // (1)
    const chatChannel = pusher.subscribe('chat_channel'); // (2)
    chatChannel.bind('pusher:subscription_succeeded', () => { // (3)
      chatChannel.bind('join', (data) => { // (4)
        handleJoin(data.name);
      });
      chatChannel.bind('part', (data) => { // (5)
        handlePart(data.name);
      });
      chatChannel.bind('message', (data) => { // (6)
        handleMessage(data.name, data.message);
      });
    });

    // Anything in here is fired on component mount.
    fetch(`${pusherConfig.restServer}/users/${'zain'}`, {
      method: 'PUT'
    });

    // return () => {
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
