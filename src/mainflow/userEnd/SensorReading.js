import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View , Button} from 'react-native';
import { setUpdateIntervalForType, SensorTypes, accelerometer ,gyroscope, orientation  } from "react-native-sensors";

setUpdateIntervalForType(SensorTypes.orientation  , 500);

export default function SensorReading() {

  function quaternionToAngles(q){
    let data = q;
  
    let ysqr = data.qy * data.qy;
    let t0 = -2.0 * (ysqr + data.qz * data.qz) + 1.0;
    let t1 = +2.0 * (data.qx * data.qy + data.qw * data.qz);
    // let t2 = -2.0 * (data.qx * data.qz - data.qw * data.qy);
    let t3 = +2.0 * (data.qy * data.qz + data.qw * data.qx);
    let t4 = -2.0 * (data.qx * data.qx + ysqr) + 1.0;
  
    // t2 = t2 > 1.0 ? 1.0 : t2;
    // t2 = t2 < -1.0 ? -1.0 : t2;
  
    const toDeg = 180 / Math.PI;
  
    const euler = {};
    // euler.pitch = Math.asin(t2) * toDeg;
    euler.roll = Math.atan2(t3, t4) * toDeg;
    euler.yaw = Math.atan2(t1, t0) * toDeg;
 
    return euler;
  }

  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
     
  //Call Once when Screen loads
  useEffect(() => {
    
    // setInterval(()=>{
      _subscribe();
        
  }, []);


 function _subscribe(){

   orientation.subscribe(({qx, qy, qz, qw, pitch, roll, yaw}) =>{
        // setData({'qx':qx, 'qy':qy, 'qz':qz, 'qw':qw, 'pitch':pitch, 'roll':roll, 'yaw':yaw});
        let dat = {'qx':qx, 'qy':qy, 'qz':qz, 'qw':qw,};
        let euler = quaternionToAngles(dat);

        // setData({'roll':round(euler.roll), 'yaw':round(euler.yaw)});
        setData({'roll':getAngle('roll',euler.roll), 'yaw':getAngle('yaw',euler.yaw)});

        setData2({'roll':round(euler.roll), 'yaw':round(euler.yaw)});
      }) 
  }

  return(
    <>
      {/* <Text style={{color:'black'}}> x : {data?data.pitch:null} </Text> */}
      <Text style={{color:'black'}}> y : {data?data.roll:null} </Text>
      <Text style={{color:'black'}}> z : {data?data.yaw:null} </Text>

      <Text style={{color:'black'}}>------------------</Text>

      <Text style={{color:'black'}}> y : {data2?data2.roll:null} </Text>
      <Text style={{color:'black'}}> z : {data2?data2.yaw:null} </Text>
    </>
    
  )
}

function getAngle(type , angle){

  if(type === 'roll'){
    if (angle > 160){
      return 155
    }else if(angle > -90 && angle < 20){
      return 25
    }else if(angle < -90){
      return 155
    }

  }else if(type === 'yaw'){
    if(angle > -90 && angle < 0){
      return 5
    }else if(angle < -90){
      return 175
    }
  }

  

  if (angle < 10){
    return 5
  }else if (angle < 20){
    return 15
  }else if (angle < 30){
    return 25
  }else if (angle < 40){
    return 35
  }else if (angle < 50){
    return 45
  }else if (angle < 60){
    return 55
  }else if (angle < 70){
    return 65
  }else if (angle < 80){
    return 75
  }else if (angle < 90){
    return 85
  }else if (angle < 100){
    return 95
  }else if (angle < 110){
    return 105
  }else if (angle < 120){
    return 115
  }else if (angle < 130){
    return 125
  }else if (angle < 140){
    return 135
  }else if (angle < 150){
    return 145
  }else if (angle < 160){
    return 155
  }else if (angle < 170){
    return 165
  }else if (angle < 180){
    return 175
  }
}

function round(n) {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  }
