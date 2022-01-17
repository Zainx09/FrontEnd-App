import React from 'react';
import { useState , useEffect} from 'react';
import Pusher from 'pusher-js/react-native';
import {View, StyleSheet, Text, KeyboardAvoidingView, Button } from 'react-native';

import pusherConfig from './pusher.json';
import ChatView from './ChatView';

export default PusherApp=(props)=>{
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

    }, []);
    

    

    const handleJoin=(name)=>{ // (4)
      // const mess = messages.slice();
      // mess.push({action: 'join', name: name});
      // setMessages(mess)

      setMessages({action: 'join', name: name, message: 'Connected'})

      // this.setState({
      //   messages: mess
      // });
    }
      
    const handlePart=(name)=>{ // (5)
      // const mess = messages.slice();
      // mess.push({action: 'part', name: name});
      // setMessages(mess)

      setMessages({action: 'part', name: name , message: 'Disconnected'})
      // this.setState({
      //   messages: messages
      // });

    }
     
    const handleMessage=(name, message)=>{
      // const mess = messages.slice();
      // mess.push({action: 'message', name: name, message: message});
      // setMessages(mess)

      setMessages({action: 'message', name: name, message: message})
      // this.setState({
      //   messages: messages
      // });
    } 
    


    // function componentDidMount() { // (7)
    //     fetch(`${pusherConfig.restServer}/users/${props.name}`, {
    //       method: 'PUT'
    //     });
    // }

    // Similar to componentDidMount and componentDidUpdate:
    // useEffect(() => {
    //     fetch(`${pusherConfig.restServer}/users/${props.name}`, {
    //         method: 'PUT'
    //       });
    // });
    




    // function componentWillUnmount() { // (8)
    //     fetch(`${pusherConfig.restServer}/users/${props.name}`, {
    //       method: 'DELETE'
    //     });
    // }

    // Similar to componentWillUnmount
    useEffect(() => {
      // Anything in here is fired on component mount.
      fetch(`${pusherConfig.restServer}/users/${props.name}`, {
        method: 'PUT'
      });

      return () => {
        // Anything in here is fired on component unmount.
        fetch(`${pusherConfig.restServer}/users/${props.name}`, {
            method: 'DELETE'
        });
      }
    }, [])
    
    const onSendMessage=(text)=>{ // (9)
      const payload = {
          message: text
      };
      fetch(`${pusherConfig.restServer}/users/${props.name}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }

    

    return (
      <View style={{flex:1}}>
        
        <ChatView messages={ messages } onSendMessage={ onSendMessage } />

      </View>
      
      );
}
