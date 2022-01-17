import React, {useRef , useState} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, KeyboardAvoidingView, Button, TouchableOpacity } from 'react-native';
// import { Constants } from 'expo';


export default ChatView = (props)=>{
  
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
      {/* <FlatList data={ props.messages } 
                renderItem={ renderItem }
                styles={ styles.messages } /> */}
      <Text>{props.messages.message}</Text>
      {/* <Text>{msg}</Text> */}
      
      <View style={styles.Navigation}>
                
        <TouchableOpacity onPressIn={()=>onSendMessage('up', 'UP IN')} onPressOut={()=>onSendMessage('up', 'UP OUT')}>
          <Text style={{color:'black'}}>UP</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.Navigation}>

        <TouchableOpacity onPressIn={()=>onSendMessage('left', 'LEFT IN')} onPressOut={()=>onSendMessage('left', 'LEFT OUT')}>
          <Text style={{color:'black'}}>LEFT</Text>
        </TouchableOpacity>

        <TouchableOpacity onPressIn={()=>onSendMessage('right', 'RIGHT IN')} onPressOut={()=>onSendMessage('right', 'RIGHT OUT')}>
          <Text style={{color:'black'}}>RIGHT</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.Navigation}>

        <TouchableOpacity onPressIn={()=>onSendMessage('down', 'DOWN IN')} onPressOut={()=>onSendMessage('down', 'DOWN OUT')}>
          <Text style={{color:'black'}}>DOWN</Text>
        </TouchableOpacity>
        
      </View>

      

      

      

      
       
      
      
      {/* <TextInput autoFocus
                  keyboardType="default"
                  returnKeyType="done"
                  enablesReturnKeyAutomatically
                  style={ styles.input }
                  blurOnSubmit={ false }
                  onSubmitEditing={ onSendMessage }
                  // ref={inputRef}
                  /> */}
      
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
    borderWidth:2,
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30
  },
  Navigation:{
    height:80,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-evenly',
    borderWidth:1,
    borderColor:'black'
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