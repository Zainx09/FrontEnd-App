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

import SignUpFlow from './src/signupflow/SignUpFlow';
import MainFlow from './src/mainflow/MainFlow';
import SplashScreen from './src/SplashScreen';
import MainScreen from './src/pusherApp/MainScreen';

const Stack = createNativeStackNavigator();

export default function App(){
  return (

    <NavigationContainer>
        <Stack.Navigator 
            screenOptions={{
            headerShown: false
            }}>
            {/* <Stack.Screen name="MainScreen" component={MainScreen} /> */}
            {/* <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="SignUpFlow" component={SignUpFlow} /> */}
            <Stack.Screen name="MainFlow" component={MainFlow} />
        </Stack.Navigator>

    </NavigationContainer>
    
  );
}


