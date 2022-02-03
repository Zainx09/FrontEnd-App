import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';

//AsyncStorage.removeItem('userId');
export default function HomePage({navigation}){

  async function goToScreen(command){
    if(command === 'userEnd'){
      navigation.navigate('UserEndScreen')

    }else if(command === 'roboticEnd'){
      navigation.navigate('RoboticEndScreen')

    }else if(command === 'logout'){
      await AsyncStorage.removeItem('token');
      navigation.dispatch(
        StackActions.replace('SignInScreen'))
      // navigation.navigate('SplashScreen')
      
    }
  }
  return (
    
    <View style={{flex:1, alignItems:'center', justifyContent:'space-evenly'}}>

      <TouchableOpacity 
        style={{width:200, height:100, alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
        onPress={()=>{goToScreen('userEnd')}}
        >
        <Text style={{color:'black', fontSize:30}}>User End</Text>
      </TouchableOpacity>


      <TouchableOpacity 
      style={{width:200, height:100, alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
      onPress={()=>{goToScreen('roboticEnd')}}
      >
        <Text style={{color:'black', fontSize:30}}>Robotic End</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={{width:200, height:100, alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
      onPress={()=>{goToScreen('logout')}}
      >
        <Text style={{color:'black', fontSize:30}}>Logout</Text>
      </TouchableOpacity>
        
    </View>
  );
}
