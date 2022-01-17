import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';




export default function HomePage({navigation}){

  function goToScreen(screen){
    if(screen === 'userEnd'){
      navigation.navigate('UserEndScreen')

    }else if(screen === 'roboticEnd'){
      navigation.navigate('RoboticEndScreen')
    }
  }
  return (
    
    <View style={{flex:1, alignItems:'center', justifyContent:'space-evenly', borderWidth:10, borderStyle:'solid' , borderColor:'red'}}>

      <TouchableOpacity 
        style={{width:200, height:150, alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
        onPress={()=>{goToScreen('userEnd')}}
        >
        <Text style={{color:'black', fontSize:30}}>User End</Text>
      </TouchableOpacity>


      <TouchableOpacity 
      style={{width:200, height:150, alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
      onPress={()=>{goToScreen('roboticEnd')}}
      >
        <Text style={{color:'black', fontSize:30}}>Robotic End</Text>
      </TouchableOpacity>
        
    </View>
  );
}
