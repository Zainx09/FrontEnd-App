import React, {useRef , useState} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, KeyboardAvoidingView, Button, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


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
      
      <View style={[styles.Navigation , {alignItems:'flex-end'}]}>
        <TouchableOpacity 
          // style={{width:'100%', height:'100%', flexDirection:'column' , alignItems:'center' , justifyContent:'center'}}
          style={styles.buttonStyle}
          onPressIn={()=>onSendMessage('left', 'LEFT IN')} 
          onPressOut={()=>onSendMessage('left', 'LEFT OUT')}>
          <Text style={{color:'#ececec' ,fontSize:30 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>{"<"}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.Navigation , {flexDirection:'column', justifyContent:'space-between'}]}>
          <TouchableOpacity 
            // style={{height:'50%', width:'100%', justifyContent:'center' , borderWidth:1 , alignItems:'center'}}
            style={styles.buttonStyle}
            onPressIn={()=>onSendMessage('go', 'GO IN')} 
            onPressOut={()=>onSendMessage('go', 'GO OUT')}>
            <Text style={{color:'#ececec' ,fontSize:35 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>{"^"}</Text>
          </TouchableOpacity>

          
          
          <TouchableOpacity 
            // style={{height:'50%', width:'100%', justifyContent:'center' , borderWidth:1 , alignItems:'center'}}
            style={styles.buttonStyle}
            onPressIn={()=>onSendMessage('back', 'BACK IN')} 
            onPressOut={()=>onSendMessage('back', 'BACK OUT')}>
            <Text style={{color:'#ececec' ,fontSize:28 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>{"v"}</Text>
          </TouchableOpacity>

      </View>

      <View style={[styles.Navigation , {alignItems:'flex-start'}]}>
          <TouchableOpacity 
            // style={{width:'100%' , height:'100%', flexDirection:'column' , alignItems:'center' , justifyContent:'center'}}
            style={styles.buttonStyle} 
            onPressIn={()=>onSendMessage('right', 'RIGHT IN')} 
            onPressOut={()=>onSendMessage('right', 'RIGHT OUT')}>
            <Text style={{color:'#ececec' ,fontSize:30 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>{">"}</Text>
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
    paddingVertical:15,
    justifyContent:'center',
    backgroundColor:'#c3c3c3'
  },
  Navigation:{
    width:'35%',
    alignItems:'center',
    justifyContent:'space-evenly'
  },
  messages: {
    alignSelf: 'stretch'
  },
  input: {
    alignSelf: 'stretch'
  },
  joinPart: {
    fontStyle: 'italic'
  },

  buttonStyle:{
    width:'60%',
    height:75,
    borderWidth:4,
    borderColor:'#075d9a',
    borderRadius:35,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#098ae4'
  }
});