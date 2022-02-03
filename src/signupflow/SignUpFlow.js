import React from "react";
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../api/Api'

import SignUpScreen from "./SignUpScreen";
import SignInScreen from "./SignInScreen";


const SignUpStack = createNativeStackNavigator();

export default function SignUpFlow({navigation}){

    
    return(
        <></>
        // <SafeAreaView style={{ flex: 1}}>
        //     <NavigationContainer>
        //         <SignUpStack.Navigator
        //         screenOptions={{
        //             headerShown: false
        //             }}>
        //             <SignUpStack.Screen name="SignUpScreen" component={SignUpScreen} />
        //             <SignUpStack.Screen name="SignInScreen" component={SignInScreen} />
        //         </SignUpStack.Navigator>
        //     </NavigationContainer>
        // </SafeAreaView>
        
    )
}