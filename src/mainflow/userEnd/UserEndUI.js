import 'react-native-gesture-handler';
import { useState , useEffect} from 'react';
import React from 'react';
import Pusher from 'pusher-js/react-native';
import { StyleSheet, Text, View , TouchableOpacity, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {StackActions} from '@react-navigation/native';


export default function UserEndUI({navigation}){

  const [type , setType] = useState('');

  function goToScreen(control){
    // if(screen === 'VideoCallScreen'){
    //     navigation.navigate('VideoCallScreen')

    // } else if(screen === 'VideoCallScreenWithControlls'){
    //     navigation.navigate('VideoCallScreenWithControlls')
        
    // }

    navigation.navigate('VideoCallScreenWithControlls', {control} )
   
    
  }

  return (
      // <View style={{flex:1, alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'white'}}>

      //   <Text style={{color:'#848484', fontSize:25 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Select Calling Type</Text>

      //   <TouchableOpacity 
      //     style={styles.buttonStyle}
      //     // onPress={()=>{goToScreen('VideoCallScreen')}}
      //     onPress={()=>{goToScreen(false)}}
      //     >
      //     <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Without Navigation</Text>
      //   </TouchableOpacity>


      //   <TouchableOpacity 
      //   style={styles.buttonStyle}
      //   // onPress={()=>{goToScreen('VideoCallScreenWithControlls')}}
      //   onPress={()=>{goToScreen(true)}}
      //   >
      //     <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>With Navigation</Text>
      //   </TouchableOpacity>
      
      // </View>

      <View style={{flex:1, alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'#f0f0f0'}}>

        <Text style={{color:'#848484', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Control Robot</Text>

        {type === 'withNavigation' ? 
          <View style={{width:'90%' , height:'50%', backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'gray', alignItems:'center', justifyContent:'space-evenly'}}>
            <Text style={[styles.textStyle , {fontWeight:'bold', color:'gray'}]}>From This Phone</Text>
            <Image 
              source={require("../../Animations/withNavigation.gif")}  
              style={{width:'40%', height:'40%'}}
            />
        
            <Text style={[styles.textStyle , {color:'gray' , paddingHorizontal:10}]}>Use this Phone to control the Robot</Text>
        
            <TouchableOpacity 
              style={[styles.buttonStyle , {height:'16%', backgroundColor:'#a88ed6', borderColor:'#9072c5', borderWidth:4}]} 
              onPress={()=>{goToScreen(true)}}>
                <Text style={styles.textStyle}>Let's Start</Text>
            </TouchableOpacity>
          </View>

          :


          <TouchableOpacity 
            style={styles.buttonStyle}
            // onPress={()=>{goToScreen('VideoCallScreen')}}
            onPress={()=>{setType('withNavigation')}}
            >
            <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>From This Phone</Text>
          </TouchableOpacity>
        }

        {type === 'withoutNavigation' ? 
          <View style={{width:'90%' , height:'50%', backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'gray', alignItems:'center', justifyContent:'space-evenly'}}>
            <Text style={[styles.textStyle , {fontWeight:'bold', color:'gray'}]}>From Controller</Text>
            <Image 
              source={require("../../Animations/withoutNavigation.gif")}  
              style={{width:'90%', height:'45%'}}
            />
        
            <Text style={[styles.textStyle , {color:'gray', paddingHorizontal:10}]}>Use controller to control the Robot</Text>
        
            <TouchableOpacity 
              style={[styles.buttonStyle , {height:'16%', backgroundColor:'#a88ed6', borderColor:'#9072c5', borderWidth:4}]} 
              onPress={()=>{goToScreen(false)}}>
                <Text style={styles.textStyle}>Let's Start</Text>
            </TouchableOpacity>
          </View>

          :

          <TouchableOpacity 
            style={styles.buttonStyle}
            // onPress={()=>{goToScreen('VideoCallScreen')}}
            onPress={()=>{setType('withoutNavigation')}}
            >
            <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>From Controller</Text>
          </TouchableOpacity>
        }
        

        {/* <View style={{width:'90%' , height:'50%', backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'gray', alignItems:'center', justifyContent:'space-evenly'}}>
          <Text style={[styles.textStyle , {fontWeight:'bold', color:'gray'}]}>With Navigaton</Text>
          <Image 
            source={require("../../Animations/withNavigation.gif")}  
            style={{width:'45%', height:'40%'}}
          />
      
          <Text style={[styles.textStyle , {color:'gray'}]}>Use your Phone to control Robot</Text>
      
          <TouchableOpacity 
            style={styles.buttonStyle} 
            onPress={()=>{goToScreen(screen)}}>
              <Text style={styles.textStyle}>Let's Start</Text>
          </TouchableOpacity>
        </View>

        <View style={{width:'90%' , height:'50%', backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'gray', alignItems:'center', justifyContent:'space-evenly'}}>
          <Text style={[styles.textStyle , {fontWeight:'bold', color:'gray'}]}>With Navigaton</Text>
          <Image 
            source={require("../../Animations/withNavigation.gif")}  
            style={{width:'45%', height:'40%'}}
          />
      
          <Text style={[styles.textStyle , {color:'gray'}]}>Use your Phone to control Robot</Text>
      
          <TouchableOpacity 
            style={styles.buttonStyle} 
            onPress={()=>{goToScreen(screen)}}>
              <Text style={styles.textStyle}>Let's Start</Text>
          </TouchableOpacity>
        </View> */}

        
        

        {/* <TouchableOpacity 
          style={styles.buttonStyle}
          // onPress={()=>{goToScreen('VideoCallScreen')}}
          onPress={()=>{goToScreen(false)}}
          >
          <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Without Navigation</Text>
        </TouchableOpacity>


        <TouchableOpacity 
        style={styles.buttonStyle}
        // onPress={()=>{goToScreen('VideoCallScreenWithControlls')}}
        onPress={()=>{goToScreen(true)}}
        >
          <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>With Navigation</Text>
        </TouchableOpacity> */}
      
      </View>

  );
}


const styles = StyleSheet.create({

  buttonStyle:{
    width:'85%', 
    height:'12%',
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#57bec5', 
    borderWidth:5,
    borderColor:'#14a2ab',
    borderRadius:10,
    
  },
  textStyle:{
    color:'white', 
    fontSize:15,
    fontFamily:'sans-serif-medium',
    textAlign:'center',
    fontWeight:'bold'
  },
})
