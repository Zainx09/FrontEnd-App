import 'react-native-gesture-handler';
import { useState , useEffect} from 'react';
import React from 'react';
import Pusher from 'pusher-js/react-native';
import { StyleSheet, Text, View , TouchableOpacity, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {StackActions} from '@react-navigation/native';

//RN Paper
import { TextInput, Button } from 'react-native-paper';


export default function UserEndUI({navigation}){

  //for Button
  const [loading , setLoading] = useState(false);
  const [disable , setDisable] = useState(false);

  const [type , setType] = useState(null);

  function goToScreen(control){
    // if(screen === 'VideoCallScreen'){
    //     navigation.navigate('VideoCallScreen')

    // } else if(screen === 'VideoCallScreenWithControlls'){
    //     navigation.navigate('VideoCallScreenWithControlls')
        
    // }

    navigation.navigate('VideoCallScreenWithControlls', {control} )
   
    
  }

  return (

      <View style={{flex:1, alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'#8F6CD1'}}>

        <Text style={{color:'#e5be1a', fontSize:18 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>ROBOT CONTROLLER</Text>

      
          <TouchableOpacity 
            style={{paddingHorizontal:10, width:type == 'withNavigation' ? '90%' : '80%' , height:type == 'withNavigation' ? '45%' : '40%', backgroundColor:'white', borderWidth:type == 'withNavigation' ? 2 : 1, borderRadius:10, borderColor:type == 'withNavigation' ? 'gray':'darkgray', alignItems:'center', justifyContent:'space-evenly'}}
            onPress={()=>{setType('withNavigation')}}>
            
            <Image 
              source={type === 'withNavigation' ? require("../../Animations/withNavigation.gif") : require("../../Animations/withNavigationPic.jpg")}  
              style={{width:'40%', height:'45%'}}
            />
        
            <Text style={[styles.textStyle , {color:'gray' , paddingHorizontal:10}]}>Use this Phone to control the Robot</Text>

            {type === 'withNavigation' &&
              <TouchableOpacity 
                style={[styles.buttonStyle , {height:55, backgroundColor:'#673ab7'}]} 
                onPress={()=>{goToScreen(true)}}>
                  
                  <Text style={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Let's Start</Text>
              
              </TouchableOpacity>
            }
          </TouchableOpacity>


        
          <TouchableOpacity 
            style={{paddingHorizontal:10, width:type == 'withoutNavigation' ? '90%' : '80%' , height:type == 'withoutNavigation' ? '45%' : '40%', backgroundColor:'white', borderWidth:type == 'withoutNavigation' ? 2 : 1, borderRadius:10, borderColor:type == 'withoutNavigation' ? 'gray':'darkgray', alignItems:'center', justifyContent:'space-evenly'}}
            onPress={()=>{setType('withoutNavigation')}}>
            
            <Image 
              source={type === 'withoutNavigation' ? require("../../Animations/withoutNavigation.gif") : require("../../Animations/withoutNavigationPic.jpg")}  
              style={{width:'80%', height:'50%'}}
            />
        
            <Text style={[styles.textStyle , {color:'gray', paddingHorizontal:10}]}>Use controller to control the Robot</Text>

            {type === 'withoutNavigation' &&
              <TouchableOpacity 
                style={[styles.buttonStyle , {height:55, backgroundColor:'#673ab7'}]} 
                onPress={()=>{goToScreen(false)}}>
                  
                  <Text style={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Let's Start</Text>
              
              </TouchableOpacity>
            }
            
          </TouchableOpacity>

          
      </View>

  );
}


const styles = StyleSheet.create({

  buttonStyle:{
    width:'80%', 
    height:'12%',
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#57bec5', 
    borderRadius:5,
    
  },
  textStyle:{
    color:'white', 
    fontSize:15,
    fontFamily:'sans-serif-medium',
    textAlign:'center',
    fontWeight:'bold'
  },
})
