import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';

//RN Paper
import { TextInput, Button } from 'react-native-paper';

//AsyncStorage.removeItem('userId');
export default function SettingScreen({navigation}){

    async function goToScreen(command){
        if(command === 'callLogs'){
          navigation.navigate('CallLogScreen')
        return
    
        }else if(command === 'logout'){
          await AsyncStorage.removeItem('token');
          navigation.dispatch(
            StackActions.replace('SignInScreen'))
        return
          
        }
      }

    return(
        <View style={{flex:1, alignItems:'center', justifyContent:'space-evenly'}}>
          <View style={{width:'90%' , height:'50%' , borderWidth:2, borderColor:'darkgray', backgroundColor:'white', borderRadius:20, justifyContent:'space-evenly' , alignItems:'center'}}>
            <Text style={[styles.textStyle , {fontWeight:'bold', color:'gray', fontSize:18, marginLeft:10}]}>EXTRAS</Text>

           

            <Button 
              style={{width:'75%', height:'20%', backgroundColor:'#57bec5', borderColor:'#14a2ab', borderWidth:3, borderRadius:10, flexDirection:'row', alignItems:'center' , justifyContent:'center'}} 
              labelStyle={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
              uppercase={false}
              mode="contained" 
              icon='bluetooth'
              onPress={()=>{goToScreen('callLogs')}}>
                
                Call Logs
            </Button>

            <Button 
              style={{width:'75%', height:'20%', backgroundColor:'darkgray', borderColor:'gray', borderWidth:3, borderRadius:10, flexDirection:'row', alignItems:'center' , justifyContent:'center'}} 
              labelStyle={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
              uppercase={false}
              mode="contained" 
              icon='logout'
              onPress={()=>{goToScreen('logout')}}>
                
                Call Logs
            </Button>
      
      
            {/* <TouchableOpacity 
              style={{width:200, height:100, alignItems:'center', justifyContent:'center', borderWidth:1, borderStyle:'solid' , borderColor:'black'}}
              onPress={()=>{goToScreen('logout')}}
              >
              <Text style={{color:'black', fontSize:30}}>Logout</Text>
            </TouchableOpacity> */}
          </View>
            

        </View>
    )
}

const styles = StyleSheet.create({

  textStyle:{
    color:'white', 
    fontSize:14,
    fontFamily:'sans-serif-medium',
    textAlign:'center',
    fontWeight:'bold'
  }
})