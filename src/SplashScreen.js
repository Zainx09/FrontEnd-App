import 'react-native-gesture-handler';
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View , Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';

import Api from './api/Api'

//Network
import NetInfo from "@react-native-community/netinfo";


// import MainFlow from './mainflow/MainFlow';
// import SignUpFlow from './signupflow/SignUpFlow';

import { AllContext } from '../App';

export default function SplashScreen({navigation}){

    //useContext for user data
    const {UserData} = useContext(AllContext);
    const [userData, setUserData] = UserData;

    const [isConnection , setIsconnection] = useState(false);

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
                    
                }
            }else{
                console.log('Token Not found')
                return(
                    navigation.dispatch(
                        StackActions.replace('SignUpScreen'))
                )
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

        const unsubscribe = NetInfo.addEventListener(state => {
            console.log("Is connected?", state.isConnected);
            setIsconnection(state.isConnected)
        });
        
        let interval = setTimeout(()=>{
            if(isConnection){
                checkLogin();
            }
            
        }, 3000);

        return(()=>{
            unsubscribe();
            clearInterval(interval);
        })
      },[isConnection]);



  return (
        <View style={{flex:1}}>

            {!isConnection && 
                <Text style={{backgroundColor:'#835BCE', fontFamily:'sans-serif-medium', fontSize:16 , fontWeight:'bold', color:'lightgray', textAlign:'center', paddingVertical:5, fontStyle:'italic'}}>
                    No Internet Connection !
                </Text>}

            <View style={{ flex: 1, backgroundColor:'#8F6AD4', alignItems:'center', justifyContent:'center'}}>
                <Text style={{color:'#e5be1a', fontFamily:'sans-serif-medium', fontSize:20 , fontWeight:'bold', marginBottom:30 , fontStyle:'italic'}}>Just a Moment!</Text>
                <Image 
                    source={require('./Animations/splashGif.gif')}  
                    // style={{width:'70%', height:'50%'}}
                    style={{width:'100%', height:'50%'}}
                />
            </View>
        </View>

    
   
  );
}
