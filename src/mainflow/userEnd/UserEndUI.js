import 'react-native-gesture-handler';
import { useState , useEffect} from 'react';
import React from 'react';
import Pusher from 'pusher-js/react-native';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PusherApp from '../../pusherApp/PusherApp';
import pusherConfig from '../pusher.json';
import NavigationButtons from './NavigationButtons';



export default function UserEndUI(){

  const [messages , setMessages] = useState('')
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
    //   setMessages('');
    //   // Anything in here is fired on component unmount.
    //   fetch(`${pusherConfig.restServer}/users/${'zain'}`, {
    //       method: 'DELETE'
    //   });
    // }

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



  return (
      <View style={{flex:1}}>
        <NavigationButtons messages={ messages } onSendMessage={ onSendMessage } />
      </View>
  );
}
