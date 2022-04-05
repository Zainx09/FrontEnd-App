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
      // <View style={{flex:1, alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'#f0f0f0'}}>

      //   <Text style={{color:'#848484', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Control Robot</Text>

      //   {type === 'withNavigation' ? 
      //     <View style={{width:'90%' , height:'50%', backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'gray', alignItems:'center', justifyContent:'space-evenly'}}>
      //       <Text style={[styles.textStyle , {fontWeight:'bold', color:'gray'}]}>From This Phone</Text>
      //       <Image 
      //         source={require("../../Animations/withNavigation.gif")}  
      //         style={{width:'40%', height:'40%'}}
      //       />
        
      //       <Text style={[styles.textStyle , {color:'gray' , paddingHorizontal:10}]}>Use this Phone to control the Robot</Text>
        
      //       <TouchableOpacity 
      //         style={[styles.buttonStyle , {height:'16%', backgroundColor:'#a88ed6', borderColor:'#9072c5', borderWidth:4}]} 
      //         onPress={()=>{goToScreen(true)}}>
      //           <Text style={styles.textStyle}>Let's Start</Text>
      //       </TouchableOpacity>
      //     </View>

      //     :


      //     <TouchableOpacity 
      //       style={styles.buttonStyle}
      //       // onPress={()=>{goToScreen('VideoCallScreen')}}
      //       onPress={()=>{setType('withNavigation')}}
      //       >
      //       <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>From This Phone</Text>
      //     </TouchableOpacity>
      //   }

      //   {type === 'withoutNavigation' ? 
      //     <View style={{width:'90%' , height:'50%', backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'gray', alignItems:'center', justifyContent:'space-evenly'}}>
      //       <Text style={[styles.textStyle , {fontWeight:'bold', color:'gray'}]}>From Controller</Text>
      //       <Image 
      //         source={require("../../Animations/withoutNavigation.gif")}  
      //         style={{width:'90%', height:'45%'}}
      //       />
        
      //       <Text style={[styles.textStyle , {color:'gray', paddingHorizontal:10}]}>Use controller to control the Robot</Text>
        
      //       <TouchableOpacity 
      //         style={[styles.buttonStyle , {height:'16%', backgroundColor:'#a88ed6', borderColor:'#9072c5', borderWidth:4}]} 
      //         onPress={()=>{goToScreen(false)}}>
      //           <Text style={styles.textStyle}>Let's Start</Text>
      //       </TouchableOpacity>
      //     </View>

      //     :

      //     <TouchableOpacity 
      //       style={styles.buttonStyle}
      //       // onPress={()=>{goToScreen('VideoCallScreen')}}
      //       onPress={()=>{setType('withoutNavigation')}}
      //       >
      //       <Text style={{color:'white', fontSize:17 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>From Controller</Text>
      //     </TouchableOpacity>
      //   }
      
      // </View>


      <View style={{flex:1, alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'#f0f0f0'}}>

        <Text style={{color:'#848484', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Robot Controller</Text>

      
          <TouchableOpacity 
            style={{width:type == 'withNavigation' ? '85%' : '80%' , height:type == 'withNavigation' ? '45%' : '40%', backgroundColor:'white', borderWidth:type == 'withNavigation' ? 4 : 3, borderRadius:20, borderColor:type == 'withNavigation' ? 'gray':'darkgray', alignItems:'center', justifyContent:'space-evenly'}}
            onPress={()=>{setType('withNavigation')}}>
            
            <Image 
              source={type === 'withNavigation' ? require("../../Animations/withNavigation.gif") : require("../../Animations/withNavigationPic.jpg")}  
              style={{width:'40%', height:'45%'}}
            />
        
            <Text style={[styles.textStyle , {color:'gray' , paddingHorizontal:10}]}>Use this Phone to control the Robot</Text>

            {type === 'withNavigation' &&
              <TouchableOpacity 
                style={[styles.buttonStyle , {height:'18%', borderWidth:4, backgroundColor:'#a88ed6', borderColor:'#9072c5'}]} 
                onPress={()=>{goToScreen(true)}}>
                  
                  <Text style={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Let's Start</Text>
              
              </TouchableOpacity>
            }
          </TouchableOpacity>


        
          <TouchableOpacity 
            style={{width:type == 'withoutNavigation' ? '85%' : '80%' , height:type == 'withoutNavigation' ? '45%' : '40%', backgroundColor:'white', borderWidth:type == 'withoutNavigation' ? 4 : 3, borderRadius:20, borderColor:type == 'withoutNavigation' ? 'gray':'darkgray', alignItems:'center', justifyContent:'space-evenly'}}
            onPress={()=>{setType('withoutNavigation')}}>
            
            <Image 
              source={type === 'withoutNavigation' ? require("../../Animations/withoutNavigation.gif") : require("../../Animations/withoutNavigationPic.jpg")}  
              style={{width:'80%', height:'50%'}}
            />
        
            <Text style={[styles.textStyle , {color:'gray', paddingHorizontal:10}]}>Use controller to control the Robot</Text>

            {type === 'withoutNavigation' &&
              <TouchableOpacity 
                style={[styles.buttonStyle , {height:'18%', borderWidth:4, backgroundColor:'#a88ed6', borderColor:'#9072c5'}]} 
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
    borderWidth:5,
    borderColor:'#14a2ab',
    borderRadius:15,
    
  },
  textStyle:{
    color:'white', 
    fontSize:15,
    fontFamily:'sans-serif-medium',
    textAlign:'center',
    fontWeight:'bold'
  },
})
