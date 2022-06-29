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
    
        }else if(command === 'changePassword'){
          navigation.navigate('ChangePasswordScreen')
          return

        }else if(command === 'logout'){
          await AsyncStorage.removeItem('token');
          navigation.dispatch(
            StackActions.replace('SignInScreen'))
          return
        }
      }

    return(
        <View style={{flex:1, alignItems:'center', justifyContent:'space-evenly', backgroundColor:'#f7f7f7'}}>
          <View style={{width:'90%' , height:'60%' , borderWidth:1, borderColor:'darkgray', backgroundColor:'white', borderRadius:10, justifyContent:'space-evenly' , alignItems:'center'}}>
            
            <Text style={[styles.textStyle , {fontWeight:'bold', color:'#263238', fontSize:15, marginLeft:10}]}>SETTINGS</Text>

            <Button 
              style={{width:'80%', height:55, backgroundColor:'#455a64', borderRadius:5, flexDirection:'row', alignItems:'center' , justifyContent:'center'}} 
              labelStyle={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
              uppercase={false}
              mode="contained" 
              icon='call-made'
              onPress={()=>{goToScreen('callLogs')}}>
                
                View Call Logs
            </Button>

            <Button 
              style={{width:'80%', height:55, backgroundColor:'#455a64', borderRadius:5, flexDirection:'row', alignItems:'center' , justifyContent:'center'}} 
              labelStyle={{color:'white', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
              uppercase={false}
              mode="contained" 
              icon='key'
              onPress={()=>{goToScreen('changePassword')}}>
                
                Change Password
            </Button>

            <Button 
              style={{width:'50%', height:55, backgroundColor:'white', borderColor:'lightgray', borderWidth:0.2, borderRadius:5, flexDirection:'row', alignItems:'center' , justifyContent:'center'}} 
              labelStyle={{color:'#a51d1d', fontSize:13, fontFamily:'sans-serif-medium' , fontWeight:'bold'}}
              uppercase={false}
              mode="contained" 
              icon='logout'
              onPress={()=>{goToScreen('logout')}}>
                
                Logout
            </Button>
    
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