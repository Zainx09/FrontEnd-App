import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DeviceMotion } from 'expo-sensors'; 


export default function SensorReading() {

    const [data, setData] = useState({});
    //Call Once when Screen loads
    useEffect(() => {
      //Subscribe Function
      _subscribe();
      //Call Once when Screen unloads
      return () => {
        _unsubscribe(); //Unsubscribe Function
      };
    }, []);
  
    //SetInterval between listening of 2 DeviceMotion Action
    const _setInterval = () => {
      DeviceMotion.setUpdateInterval(77);
    };
  
    const _subscribe = () => {
      //Adding the Listener
      DeviceMotion.addListener((devicemotionData) => {
        setData(devicemotionData.rotation);
      });
      //Calling setInterval Function after adding the listener
      _setInterval();
    };
  
    const _unsubscribe = () => {
      //Removing all the listeners at end of screen unload
      DeviceMotion.removeAllListeners();
    };
  
  
    // let { beta, gamma } = data;
    // gamma = round(gamma);
    // beta = round(beta);
  
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          backgroundColor: "#BBB",
        }}
      >
        
        <Text>
          {/* y-axis */}
          {JSON.stringify("Y-axis : "+round( (data.gamma)*(180/3.142) ))}
        </Text>
  
        
        <Text>
          {JSON.stringify("X-axis : "+round( (data.alpha)*(180/3.142) ))}
        </Text>
        
      </View>
    );

}

function round(n) {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  }