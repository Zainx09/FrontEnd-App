import 'react-native-gesture-handler';
import { useState , useEffect} from 'react';
import React from 'react';
import Pusher from 'pusher-js/react-native';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {StackActions} from '@react-navigation/native';


export default function UserEndUI({navigation}){

  function goToScreen(screen){
    if(screen === 'VideoCallScreen'){
        navigation.navigate('VideoCallScreen')

    } else if(screen === 'VideoCallScreenWithControlls'){
        navigation.navigate('VideoCallScreenWithControlls')
        
    }else if(screen === 'VideoCallScreenWithVirtualControlls'){
      navigation.navigate('VideoCallScreenWithVirtualControlls')

  }
   
    
  }

  return (
      <View style={{flex:1, alignItems:'center', justifyContent:'space-evenly'}}>

        <Text style={{color:'black'}}>Select Calling Option</Text>

        <TouchableOpacity 
          style={{width:'60%', height:100, alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
          onPress={()=>{goToScreen('VideoCallScreen')}}
          >
          <Text style={{color:'black', fontSize:20}}>Only Video Call</Text>
        </TouchableOpacity>


        <TouchableOpacity 
        style={{width:'60%', height:100, alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
        onPress={()=>{goToScreen('VideoCallScreenWithControlls')}}
        >
          <Text style={{color:'black', fontSize:20}}>With Navigation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={{width:'60%', height:100, alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
        onPress={()=>{goToScreen('VideoCallScreenWithVirtualControlls')}}
        >
          <Text style={{color:'black', fontSize:20}}>With Virtual Navigation</Text>
        </TouchableOpacity>
          
      </View>

  );
}
