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
      <View style={{flex:1, alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'white'}}>

        <Text style={{color:'#848484', fontSize:25 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Select Calling Type</Text>

        <TouchableOpacity 
          style={styles.buttonStyle}
          onPress={()=>{goToScreen('VideoCallScreen')}}
          >
          <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Without Navigation</Text>
        </TouchableOpacity>


        <TouchableOpacity 
        style={styles.buttonStyle}
        onPress={()=>{goToScreen('VideoCallScreenWithControlls')}}
        >
          <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>With Navigation</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity 
        style={{width:'60%', height:100, alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
        onPress={()=>{goToScreen('VideoCallScreenWithVirtualControlls')}}
        >
          <Text style={{color:'black', fontSize:20}}>With Virtual Navigation</Text>
        </TouchableOpacity> */}
          
      </View>

  );
}


const styles = StyleSheet.create({

  buttonStyle:{
    width:'85%', 
    height:'30%', 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#a3c0e5', 
    borderWidth:5,
    borderColor:'#6e8aa1',
    borderRadius:25
  }
})
