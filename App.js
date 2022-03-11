// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import Home from './screens/Home';
// import Live from './screens/Live';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const options = { headerShown: false };
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Home" component={Home} options={options} />
//         <Stack.Screen name="Live" component={Live} options={options} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
// const styles = StyleSheet.create({});




// import React, {useState} from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import AgoraUIKit from 'agora-rn-uikit';
// const App = () => {
// const [videoCall, setVideoCall] = useState(true);
// const rtcProps = {
//   appId: '72c2e0389a9e4beabcddc99e0d15a9d1',
//   token:'00672c2e0389a9e4beabcddc99e0d15a9d1IAC5W+KMppWU2M++xDl3sty6tzFIe8uMtLfVN+Fpb8lZHUOQEggAAAAAEABLPQ3JlEnlYQEAAQCUSeVh',
//   channel: 'myChannel'};
// const callbacks = {EndCall: () => setVideoCall(false)};
// return videoCall ? <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> : <Text onPress={()=>setVideoCall(true)}>Start Call</Text>;
// };
// export default App;



import 'react-native-gesture-handler';
import React from 'react';
import { useState, useEffect } from 'react';
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
import MainFlow from './src/mainflow/MainFlow';
import MainScreen from './src/pusherApp/MainScreen';
import HomePage from "./src/mainflow/HomePage"
import UserEndUI from "./src/mainflow/userEnd/UserEndUI"
import VideoCallScreen from "./src/mainflow/userEnd/VideoCallScreen";
import VideoCallScreenWithControlls from "./src/mainflow/userEnd/VIdeoCallScreenWithControlls";
import VideoCallScreenWithVirtualControlls from './src/mainflow/userEnd/VideoCallScreenWithVirtualControlls';

import RoboticEndUI from "./src/mainflow/roboticEnd/RoboticEndUI"

import WebSocketScreen from './src/webSocket/WebSocket'

const Stack = createNativeStackNavigator();

export default function App(){
  return (

    // <>
    //   <SplashScreen />
    // </>

    <NavigationContainer>
        <Stack.Navigator 
            screenOptions={{
            headerShown: false
            }}>
              {/* <Stack.Screen name="WebSocketScreen" component={WebSocketScreen} /> */}

              {/* <Stack.Screen name="SplashScreen" component={SplashScreen} />

              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              <Stack.Screen name="SignInScreen" component={SignInScreen} /> */}

              {/* <Stack.Screen name="MainFlow" component={MainFlow} /> */}
              {/* <Stack.Screen name="MainScreen" component={MainScreen} /> */}
              <Stack.Screen name="HomePageScreen" component={HomePage} />
              <Stack.Screen name="UserEndScreen" component={UserEndUI} />
              <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />
              <Stack.Screen name="VideoCallScreenWithControlls" component={VideoCallScreenWithControlls} />
              <Stack.Screen name="VideoCallScreenWithVirtualControlls" component={VideoCallScreenWithVirtualControlls} />
              
              <Stack.Screen name="RoboticEndScreen" component={RoboticEndUI} />
              
            
        </Stack.Navigator>

    </NavigationContainer>
    
  );
}


