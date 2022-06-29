import React, {useRef , useState} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, KeyboardAvoidingView, Button, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


export default function NavigationButtons(props){
  
  const [go , setGo] = useState('')
  const [back , setBack] = useState('')
  const [left , setLeft] = useState('')
  const [right , setRight] = useState('')

  const type = props.type;
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
    <View style={styles.container}>
      
      <View style={styles.Navigation}>
        <TouchableOpacity 
          style={[styles.buttonStyle , {borderTopLeftRadius:20 , borderBottomLeftRadius:20}]}
          onPressIn={()=>{props.type === 'navigation' ?  onSendMessage('left', 'LEFT IN'): onSendMessage('left', 'LEFT IN R')}} 
          onPressOut={()=>{props.type === 'navigation' ?  onSendMessage('left', 'LEFT OUT') : onSendMessage('left', 'LEFT OUT R')}}>
   
          <Text style={{color:'#ececec' ,fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>{"<"}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.Navigation , {flexDirection:'column'}]}>
          <TouchableOpacity 
            style={[styles.buttonStyle , {borderTopLeftRadius:20 , borderTopRightRadius:20, height:'51%'}]}
            onPressIn={()=>{props.type === 'navigation' ?  onSendMessage('go', 'GO IN') : onSendMessage('go', 'GO IN R')}} 
            onPressOut={()=>{props.type === 'navigation' ?  onSendMessage('go', 'GO OUT') : onSendMessage('go', 'GO OUT R')}}>
              
            <Text style={{color:'#ececec' ,fontSize:22 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>{"^"}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.buttonStyle , {borderBottomLeftRadius:20 , borderBottomRightRadius:20, height:'51%'}]}
            onPressIn={()=>{props.type === 'navigation' ?  onSendMessage('back', 'BACK IN') : onSendMessage('back', 'BACK IN R')}} 
            onPressOut={()=>{props.type === 'navigation' ?  onSendMessage('back', 'BACK OUT') : onSendMessage('back', 'BACK OUT R')}}>
            
            <Text style={{color:'#ececec' ,fontSize:18 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>{"v"}</Text>
          </TouchableOpacity>

      </View>

      <View style={[styles.Navigation , {}]}>
          <TouchableOpacity 
            style={[styles.buttonStyle , {borderTopRightRadius:20 , borderBottomRightRadius:20}]}
            onPressIn={()=>{props.type === 'navigation' ?  onSendMessage('right', 'RIGHT IN') : onSendMessage('right', 'RIGHT IN R')}} 
            onPressOut={()=>{props.type === 'navigation' ?  onSendMessage('right', 'RIGHT OUT') : onSendMessage('right', 'RIGHT OUT R')}}>
            
            <Text style={{color:'#ececec' ,fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>{">"}</Text>
          </TouchableOpacity>
      </View>
    </View>

  );


  
}



const styles = StyleSheet.create({
  container: {
    height:'100%',
    flexDirection:'row',
    justifyContent:'center',
    paddingHorizontal:10,
    paddingVertical:5
  },

  Navigation:{
    width:'33%',
    alignItems:'center',
    justifyContent:'space-evenly'
  },

  buttonStyle:{
    width:'100%',
    height:'33%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#277ddb',
  }
});