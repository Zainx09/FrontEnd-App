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


// import MainFlow from './mainflow/MainFlow';
// import SignUpFlow from './signupflow/SignUpFlow';

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
                    return(
                        navigation.dispatch(
                            StackActions.replace('HomePageScreen'))
                    )
                    
                    // setFlow('MainFlow');
                }else{
                    console.log('response Not Get')
                    return(
                        navigation.dispatch(
                            StackActions.replace('SignUpScreen'))
                    )
                    
                    // setFlow('SignUpFlow');
                }
            }else{
                console.log('Token Not found')
                return(
                    navigation.dispatch(
                        StackActions.replace('SignUpScreen'))
                )
                // setFlow('SignUpFlow');
            }

        }catch(e){
            console.log("Error : ",e)
            return(
                navigation.dispatch(
                    StackActions.replace('SignUpScreen'))
            )
        }        
    }

    useEffect(() => {
        checkLogin();
      },[]);



  return (

    // <>
    //     {flow ?  flow==='MainFlow'? <MainFlow /> : <SignUpFlow />
    //         : 
    //         <SafeAreaView style={{ flex: 1 , borderWidth:1, borderStyle:'solid' , borderColor:'red'}}>
    //             <Text style={{fontSize:10 , color:'black'}}>Splash Screen</Text>
    //         </SafeAreaView>
    //     }

    // </>

        <SafeAreaView style={{ flex: 1 , borderWidth:1, borderStyle:'solid' , borderColor:'red'}}>
            <Text style={{fontSize:10 , color:'black'}}>Splash Screen</Text>
        </SafeAreaView>

    
   
  );
}
