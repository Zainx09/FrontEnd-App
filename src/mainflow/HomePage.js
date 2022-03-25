import 'react-native-gesture-handler';
import React , {useEffect} from 'react';
import { StyleSheet, Text, View , TouchableOpacity, BackHandler} from 'react-native';
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
  
      }else if(command === 'settings'){
        navigation.navigate('SettingScreen')
        // navigation.navigate('SplashScreen')
        
      }
      // else if(command === 'logout'){
      //   await AsyncStorage.removeItem('token');
      //   navigation.dispatch(
      //     StackActions.replace('SignInScreen'))
      //   // navigation.navigate('SplashScreen')
        
      // }
    }

    return (
      
      <View style={{flex:1, alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'#ffffff'}}>

        <TouchableOpacity 
          style={styles.buttonStyle}
          onPress={()=>{goToScreen('userEnd')}}
          >
          <Text style={{color:'white', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>User End</Text>
        </TouchableOpacity>
  
  
        <TouchableOpacity 
        style={styles.buttonStyle}
        onPress={()=>{goToScreen('roboticEnd')}}
        >
          <Text style={{color:'white', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Robotic End</Text>
        </TouchableOpacity>
  
        <TouchableOpacity 
        style={[styles.buttonStyle, {height:'20%'}]}
        onPress={()=>{goToScreen('settings')}}
        >
          <Text style={{color:'white', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Settings</Text>
        </TouchableOpacity>
          
      </View>
    );

}

const styles = StyleSheet.create({

  buttonStyle:{
    width:'85%', 
    height:'30%', 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#57bec5', 
    borderWidth:5,
    borderColor:'#14a2ab',
    borderRadius:25
  }
})
