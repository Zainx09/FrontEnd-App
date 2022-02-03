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

export default function VideoCallScreen({navigation}){

    const [videoCall, setVideoCall] = useState(false);

    const rtcProps = {
        appId: '72c2e0389a9e4beabcddc99e0d15a9d1',
        token:'00672c2e0389a9e4beabcddc99e0d15a9d1IAC5W+KMppWU2M++xDl3sty6tzFIe8uMtLfVN+Fpb8lZHUOQEggAAAAAEABLPQ3JlEnlYQEAAQCUSeVh',
        channel: 'myChannel'
    };

    const callbacks = {EndCall: () => setVideoCall(false)};


    return(
        <View style={{flex:1}}> 
            
                {videoCall ? 
                
                    <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> 
                    : 
                    <View style={{flex:1 , justifyContent:'center'}}>
                        <View
                            style={{alignItems:'center'}}>
                                <Text style={{fontSize:15}}>Share ID with others to join this Call</Text>
                                <Text style={{fontSize:20, marginVertical:10}}>{rtcProps.appId}</Text>

                                <TouchableOpacity 
                                    style={{width:200, height:80, marginVertical:20,  alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
                                    onPress={()=>setVideoCall(true)}
                                    >
                                    <Text style={{color:'black', fontSize:30}}>Start Call</Text>
                                </TouchableOpacity>

                                
                                
                        </View>
                    </View>
                }            

        </View>
        
    )
}