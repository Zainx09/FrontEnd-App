import 'react-native-gesture-handler';

import React from 'react';
import { useState , useEffect} from 'react';
import { StyleSheet, Text, View , TouchableOpacity , Dimensions} from 'react-native';
import Pusher from 'pusher-js/react-native';

import pusherConfig from '../pusher.json';
import AgoraUIKit from 'agora-rn-uikit';

import NavigationButtons from './NavigationButtons';


const windowHeight = Dimensions.get('window').height;

const VideoCallHeight = windowHeight*(80/100);
const buttonsHeight = windowHeight*(20/100);

export default function VideoCallScreenWithControlls({navigation}){

    const [videoCall, setVideoCall] = useState(true);

    const rtcProps = {
        appId: '72c2e0389a9e4beabcddc99e0d15a9d1',
        token:'00672c2e0389a9e4beabcddc99e0d15a9d1IAC5W+KMppWU2M++xDl3sty6tzFIe8uMtLfVN+Fpb8lZHUOQEggAAAAAEABLPQ3JlEnlYQEAAQCUSeVh',
        channel: 'myChannel'
    };

    const callbacks = {EndCall: () => setVideoCall(false)};


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

    return(
        <View style={{flex:1 , flexDirection:'column'}}> 
            
            <View style={{height:VideoCallHeight}}>

                {videoCall ? <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> : <Text onPress={()=>setVideoCall(true)}>Start Call</Text>}
        
            </View>
            
            <View style={{height:buttonsHeight}}>
                <NavigationButtons messages={ messages } onSendMessage={ onSendMessage } />
            </View>

        </View>
        
    )
}