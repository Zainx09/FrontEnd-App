import 'react-native-gesture-handler';
import React from 'react';
import { useState, useEffect , createContext} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from './src/SplashScreen';

//////////// SignUpFLow ///////////////////////
import SignUpFlow from './src/signupflow/SignUpFlow';
import SignUpScreen from "./src/signupflow/SignUpScreen";
import SignInScreen from "./src/signupflow/SignInScreen";

////////////// MainFlow ///////////////////////
// import MainFlow from './src/mainflow/MainFlow';
import HomePage from "./src/mainflow/HomePage"
import UserEndUI from "./src/mainflow/userEnd/UserEndUI"
import VideoCallScreen from "./src/mainflow/userEnd/VideoCallScreen";
import VideoCallScreenWithControlls from "./src/mainflow/userEnd/VIdeoCallScreenWithControlls";

import RoboticEndUI from "./src/mainflow/roboticEnd/RoboticEndUI"

import SettingScreen from './src/mainflow/SettingScreen';

import CallLogScreen from './src/mainflow/callLogs/CallLogScreen';

const Stack = createNativeStackNavigator();

import Ably from "ably";

const ably = new Ably.Realtime('4WmoOg.4SZS1g:w84M-soVmVHhJSbjdeEryB9MYYMIQ3WZSJVnEdMOsu4');
const channel = ably.channels.get('ABLY'); // for movement
const channel2 = ably.channels.get('ABLY2'); // for angles

const channel3 = ably.channels.get('ABLY3'); // for joystick Navigation


export const ChannelContext = createContext();

export default function App(){

  const channels = {channel , channel2 , channel3};

  return (

    <ChannelContext.Provider value={channels}>
        <NavigationContainer>
            <Stack.Navigator 
                screenOptions={{
                headerShown: false
                }}>
                  

                  
                    {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}

                    {/* <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                    <Stack.Screen name="SignInScreen" component={SignInScreen} /> */}

                    {/* <Stack.Screen name="MainFlow" component={MainFlow} />
                    <Stack.Screen name="MainScreen" component={MainScreen} /> */}

                    <Stack.Screen name="HomePageScreen" component={HomePage} />
                    <Stack.Screen name="UserEndScreen" component={UserEndUI} />
                    <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />
                    <Stack.Screen name="VideoCallScreenWithControlls" component={VideoCallScreenWithControlls} />
                    
                    <Stack.Screen name="RoboticEndScreen" component={RoboticEndUI} />

                    <Stack.Screen name="SettingScreen" component={SettingScreen} />
                    <Stack.Screen name="CallLogScreen" component={CallLogScreen} />
                  
            </Stack.Navigator>

        </NavigationContainer>
    </ChannelContext.Provider>
  );
}


