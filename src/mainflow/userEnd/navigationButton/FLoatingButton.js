import React, {useEffect, useRef , useState} from 'react';
import { StyleSheet, Text, View, FlatList, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, ToastAndroid, Clipboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

//RN Paper
import { TextInput, Button, Switch  } from 'react-native-paper';

export default function FloatingButton(props){

    const [ clicked , setClicked] = useState(false);
    
    const [loading, setLoading] = useState(false);

    const [disable , setDisable] = useState(false);

    const [isSwitchOn, setIsSwitchOn] = useState(true);

    const showToastWithGravity = (msg) => {
        ToastAndroid.showWithGravity(
          msg,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      };

    useEffect(()=>{
        if(props.btConnected){
            setDisable(true)
        }else{
            setDisable(false)
        }
    },[props.btConnected])


    async function connect_BT(){
        setDisable(true); setLoading(true);

        try{
            await props.connect_BT();

            let check = await props.checkBtConnect();

            if(check){
                setLoading(false);
            }else{
                setDisable(false); setLoading(false);
            }
        }catch(err){
            showToastWithGravity(err.message);
        }
    } 


    const [up , setUp] = useState('')
    const [down , setDown] = useState('')


    const onSendMessage=(button , text)=>{ 

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
        <View 
            style={styles.container}>

            <View style={{flexDirection:'column', width:'100%', justifyContent:'center', marginVertical:20}}>
                <TouchableOpacity 
                    style={{
                        width:40,
                        height:40,
                        alignItems:'center',
                        justifyContent:'center',
                        borderRadius:30,
                        alignSelf:'flex-end',
                        marginRight:10,
                        backgroundColor:'white',
                        
                    }}
                    onPress={()=>{setClicked(!clicked)}}>

                    <MIcon 
                        name={clicked ? "chevron-down" : "menu"}
                        size={20} 
                        color={'#292929'} />
                </TouchableOpacity>
            </View>

            {clicked && 

                <View style={{width:'80%' , backgroundColor:'white', borderRadius:20, alignItems:'center',paddingVertical:30, alignSelf:'flex-end', }}>

                    {props.callID != '' &&
                        <TouchableOpacity 
                            style={{width:'80%', marginBottom:25}}
                            onPress={() =>{
                            Clipboard.setString(props.callID)
                            showToastWithGravity("Copied!")
                            }}>
        
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', borderTopWidth:2 , borderBottomWidth:2, paddingVertical:10, borderColor:'gray'}}>
                                <Text style={{width:'60%', color:'#292929' ,fontSize:15 , fontFamily:'sans-serif-medium' , fontWeight:'bold', fontStyle:'italic', borderRightWidth:1, paddingRight:10, marginRight:10}}>ID :   {props.callID}</Text>
                                <MIcon 
                                    name="content-copy" 
                                    size={25} 
                                    color={'#292929'} />
                            </View>
                            
                        </TouchableOpacity>

                    }
                    {!props.control && 
                        <TouchableOpacity 
                            style={{height:55, width:'85%', backgroundColor:disable ? 'gray' : "#0358b7", borderRadius:15, justifyContent:'center', alignItems:'center', flexDirection:'row'}}
                            disabled={disable}
                            onPress={()=>{connect_BT()}}>
                            
                            {loading ? <ActivityIndicator size="small" color="white" />
                                :
                                <>
                                    <MIcon 
                                        name="bluetooth" 
                                        size={20} 
                                        color={'white'} />
                                    <Text style={{color:'white' ,fontSize:14 , fontFamily:'sans-serif-medium' , fontWeight:'bold',}}> Connect BT </Text> 
                                </>
                            }
                            
                            
                        </TouchableOpacity>
                    }

                    {props.control && 
                        <View style={{width:'90%' , height:60, flexDirection:'row',borderRadius:15, alignItems:'center', justifyContent:'space-evenly'}}>
                            <Text style={{color:'#292929', fontSize:14 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Use Phone Sensors?</Text>
                            <Switch value={isSwitchOn} onValueChange={()=>{setIsSwitchOn(!isSwitchOn); props.setSensors(!isSwitchOn)}} color='#277ddb'/>
                        </View>
                    }
                    
                    {props.isHeightBtn && 
                        <View style={{width:'85%', flexDirection:'row', alignItems:'center' , justifyContent:'space-evenly', marginTop:30}}>

                            <View syyle={{width:'70%', borderWidth:1}}>
                                <Text style={{color:'#434343', fontSize:14 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Adjust Height</Text>
                            </View>

                            <View style={{flexDirection:'column' , width:45, borderRadius:50, backgroundColor:'#277ddb'}}>
                                <TouchableOpacity
                                    style={{height:50, width:'100%', alignItems:'center',justifyContent:'center', borderBottomWidth:0.2 , borderColor:'white'}}
                                    onPressIn={()=>{onSendMessage('up', 'UP IN')}} 
                                    onPressOut={()=>{onSendMessage('up', 'UP OUT')}}>
                                        <Text style={{color:'white', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>^</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{height:50, width:'100%', alignItems:'center', justifyContent:'center'}}
                                    onPressIn={()=>{onSendMessage('down', 'DOWN IN')}} 
                                    onPressOut={()=>{onSendMessage('down', 'DOWN OUT')}}>
                                        <Text style={{color:'white', fontSize:14 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>v</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                </View>
                
            }

            {clicked && 
                <TouchableOpacity 
                    onPress={()=>{setClicked(false)}}
                    style={{flex:1}}>

                </TouchableOpacity>
            }
        </View>

    );


  
}


const styles = StyleSheet.create({
  container: {
    height:'100%',
    width:'100%', 
    opacity:0.7,
  },
 
});