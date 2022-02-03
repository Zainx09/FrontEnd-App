import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from "./HomePage";

import UserEndUI from "./userEnd/UserEndUI"
import VideoCallScreen from "./userEnd/VideoCallScreen";
import VideoCallScreenWithControlls from "./userEnd/VIdeoCallScreenWithControlls";

import RoboticEndUI from "./roboticEnd/RoboticEndUI"



const MainStack = createNativeStackNavigator();
export default function MainFlow({navigation}){
    return(
        <></>
        // <SafeAreaView style={{ flex: 1}}>
        //     <NavigationContainer>

        //         <MainStack.Navigator
        //             screenOptions={{
        //                 headerShown: false
        //             }}>
        //             <MainStack.Screen name="HomePageScreen" component={HomePage} />

        //             <MainStack.Screen name="UserEndScreen" component={UserEndUI} />
        //             <MainStack.Screen name="VideoCallScreen" component={VideoCallScreen} />
        //             <MainStack.Screen name="VideoCallScreenWithControlls" component={VideoCallScreenWithControlls} />

        //             <MainStack.Screen name="RoboticEndScreen" component={RoboticEndUI} />

                    
        //         </MainStack.Navigator>
        //     </NavigationContainer>

        // </SafeAreaView>
        
    )
}