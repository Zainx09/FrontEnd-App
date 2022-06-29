import React, {useRef , useState} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, KeyboardAvoidingView, Button, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


export default function HeightButtons(props){
  
  const [up , setUp] = useState('')
  const [down , setDown] = useState('')


  const onSendMessage=(button , text)=>{ // (1)

    if (button==='up'){

      if (text !== up){
        setUp(text);
        props.onSendMessage(text)
      }

    }else if (button==='down'){

      if (text !== down){
        setDown(text);
        props.onSendMessage(text)
      }
    }
  }

 
  return (
    <View style={styles.container}>
    
        <TouchableOpacity 
            style={{
                width:'100%',
                height:'50%',
                alignItems:'center',
                justifyContent:'center',
            }}
            onPressIn={()=>{onSendMessage('up', 'UP IN')}} 
            onPressOut={()=>{onSendMessage('up', 'UP OUT')}}>

            <Text style={{color:'white' ,fontSize:22 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>{"^"}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={{
                width:'100%',
                height:'50%',
                alignItems:'center',
                justifyContent:'center',
            }}
            onPressIn={()=>{onSendMessage('down', 'DOWN IN')}} 
            onPressOut={()=>{onSendMessage('down', 'DOWN OUT')}}>

            <Text style={{color:'white' ,fontSize:16 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>{"v"}</Text>
        </TouchableOpacity>

    </View>

  );


  
}


const styles = StyleSheet.create({
  container: {
    height:'100%',
    width:'100%', 
    backgroundColor:'gray',
    flexDirection:'column', 
    alignItems:'center',
    justifyContent:'space-around',
    borderRadius:30,
    paddingVertical:5,
  },
 
});