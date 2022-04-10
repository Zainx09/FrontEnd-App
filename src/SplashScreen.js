import 'react-native-gesture-handler';
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';

import Api from './api/Api'


// import MainFlow from './mainflow/MainFlow';
// import SignUpFlow from './signupflow/SignUpFlow';

import { AllContext } from '../App';

export default function SplashScreen({navigation}){

    //useContext for user data
    const {UserData} = useContext(AllContext);
    const [userData, setUserData] = UserData;

    async function checkLogin(){
        try{
            //Remove 
            // await AsyncStorage.removeItem('token')
            const token = await AsyncStorage.getItem('token')
            if(token !== null) {
                const response2 = await Api.post('/checkLogin' , { 'token': token });
                if(response2.data){

                    setUserData({
                        "email" : response2.data.email,
                        "username" : response2.data.username
                    })

                    return(
                        navigation.dispatch(
                            StackActions.replace('HomePageScreen'))
                    )
                
                }else{
                    console.log('Not Responding')
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
