import React, {useRef , useState} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, KeyboardAvoidingView, Button, TouchableOpacity } from 'react-native';
// import { Constants } from 'expo';



export default function NavigationButtons(props){
  
  const [up , setUp] = useState('')
  const [down , setDown] = useState('')
  const [left , setLeft] = useState('')
  const [right , setRight] = useState('')
  // const inputRef = useRef(null);

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

    }else if (button==='left'){

      if (text !== left){
        setLeft(text);
        props.onSendMessage(text)
      }

    }else if (button==='right'){

      if (text !== right){
        setRight(text);
        props.onSendMessage(text)
      }

    }
    // props.onSendMessage(e.nativeEvent.text);
    // inputRef.current.value = null;
    // inputRef.input.clear();
  }

 
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
    

      <View style={[styles.Navigation , {flexDirection:'column' , alignItems:'center' , justifyContent:'center'}]}>
        <TouchableOpacity onPressIn={()=>onSendMessage('left', 'LEFT IN')} onPressOut={()=>onSendMessage('left', 'LEFT OUT')}>
          <Text style={{color:'black'}}>LEFT</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.Navigation , {flexDirection:'column'}]}>
          <TouchableOpacity 
            style={{height:'50%', width:'100%', justifyContent:'center' , borderWidth:1 , alignItems:'center'}}
            onPressIn={()=>onSendMessage('up', 'UP IN')} onPressOut={()=>onSendMessage('up', 'UP OUT')}>
            <Text style={{color:'black'}}>UP</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{height:'50%', width:'100%', justifyContent:'center' , borderWidth:1 , alignItems:'center'}}
            onPressIn={()=>onSendMessage('down', 'DOWN IN')} onPressOut={()=>onSendMessage('down', 'DOWN OUT')}>
            <Text style={{color:'black'}}>DOWN</Text>
          </TouchableOpacity>
      </View>

      <View style={[styles.Navigation , {flexDirection:'column' , alignItems:'center' , justifyContent:'center'}]}>
          <TouchableOpacity onPressIn={()=>onSendMessage('right', 'RIGHT IN')} onPressOut={()=>onSendMessage('right', 'RIGHT OUT')}>
            <Text style={{color:'black'}}>RIGHT</Text>
          </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );


  
}

const renderItem=({item})=>{ // (3)
  const action = item.action;
  const name = item.name;

  if (action == 'join') {
      return <Text style={ styles.joinPart }>{ name } has joined</Text>;
  } else if (action == 'part') {
      return <Text style={ styles.joinPart }>{ name } has left</Text>;
  } else if (action == 'message') {
      return <Text>{ name }: { item.message }</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent:'center',
    borderWidth:2,  
  },
  Navigation:{
    width:'32%'
  },
  messages: {
    alignSelf: 'stretch'
  },
  input: {
    alignSelf: 'stretch'
  },
  joinPart: {
    fontStyle: 'italic'
  }
});