import React, {useRef , useState} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, KeyboardAvoidingView, Button, TouchableOpacity } from 'react-native';
// import { Constants } from 'expo';



export default function NavigationButtons(props){
  
  const [go , setGo] = useState('')
  const [back , setBack] = useState('')
  const [left , setLeft] = useState('')
  const [right , setRight] = useState('')
  // const inputRef = useRef(null);

  const onSendMessage=(button , text)=>{ // (1)

    if (button==='go'){

      if (text !== go){
        setGo(text);
        props.onSendMessage(text)
      }

    }else if (button==='back'){

      if (text !== back){
        setBack(text);
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
      
      <View style={styles.Navigation}>
        <TouchableOpacity 
          style={{width:'100%', height:'100%', flexDirection:'column' , alignItems:'center' , justifyContent:'center'}}
          onPressIn={()=>onSendMessage('left', 'LEFT IN')} 
          onPressOut={()=>onSendMessage('left', 'LEFT OUT')}>
          <Text style={{color:'black'}}>LEFT</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.Navigation , {flexDirection:'column'}]}>
          <TouchableOpacity 
            style={{height:'50%', width:'100%', justifyContent:'center' , borderWidth:1 , alignItems:'center'}}
            onPressIn={()=>onSendMessage('go', 'GO IN')} 
            onPressOut={()=>onSendMessage('go', 'GO OUT')}>
            <Text style={{color:'black'}}>GO</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{height:'50%', width:'100%', justifyContent:'center' , borderWidth:1 , alignItems:'center'}}
            onPressIn={()=>onSendMessage('back', 'BACK IN')} 
            onPressOut={()=>onSendMessage('back', 'BACK OUT')}>
            <Text style={{color:'black'}}>BACK</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.Navigation}>
          <TouchableOpacity 
            style={{width:'100%' , height:'100%', flexDirection:'column' , alignItems:'center' , justifyContent:'center'}} 
            onPressIn={()=>onSendMessage('right', 'RIGHT IN')} 
            onPressOut={()=>onSendMessage('right', 'RIGHT OUT')}>
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
    width:'35%'
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