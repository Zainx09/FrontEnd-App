import 'react-native-gesture-handler';
import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';

import Api from './api/Api'


const Stack = createNativeStackNavigator();

export default function SplashScreen({navigation}){

    async function checkLogin(){
        try{
            //Remove 
            // await AsyncStorage.removeItem('token')
            const token = await AsyncStorage.getItem('token')
            if(token !== null) {
                const response2 = await Api.post('/checkLogin' , { 'token': token });
                console.log(response2.data);
                if(response2.data){
                    navigation.dispatch(
                    StackActions.replace('MainFlow'))
                }else{
                    console.log('response Not Get')
                    navigation.dispatch(
                    StackActions.replace('SignUpFlow'))
                }
            }else{
                console.log('Token Not found')
                navigation.dispatch(
                StackActions.replace('SignUpFlow'))
            }

        }catch(e){
            console.log("Error : ",e)
        }        
    }

    useEffect(() => {
        checkLogin();
      },[]);



  return (

    <SafeAreaView style={{ flex: 1 , borderWidth:1, borderStyle:'solid' , borderColor:'red'}}>
        <Text style={{fontSize:10 , color:'black'}}>Splash Screen</Text>
    </SafeAreaView>
   
  );
}
