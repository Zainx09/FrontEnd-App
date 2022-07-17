import React, {useEffect, useRef , useState} from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, ToastAndroid, SafeAreaView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

//RN Paper
import { TextInput, Button, Switch  } from 'react-native-paper';

//varification code field
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';

const CELL_COUNT = 5;

export default function OtgScreen(props){

    function verifyCode(){

        if(props.otgCode === value){
            props.signUp()

        }else{
            showToastWithGravity('Invalid Code')
        }
        
    }

    const showToastWithGravity = (msg) => {
        ToastAndroid.showWithGravity(
          msg,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
    };

    const [value, setValue] = useState('');

    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props2, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    return(
        <SafeAreaView style={styles.root}>
            <Button 
                style={{width:30, height:30, alignSelf:'flex-start' , marginLeft:'5%', marginBottom:'10%'}}
                labelStyle={{fontSize:20, fontFamily:'sans-serif-medium' , color:'white', fontWeight:'bold'}}
                uppercase={false}
                icon="keyboard-return"
                onPress={()=>{props.setSendCode(false)}}>
            </Button>
            <Text style={styles.title}>We have sent a variffication code on "{props.email}"</Text>
            <CodeField
                ref={ref}
                {...props2}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
                )}
            />
            
            <Button 
                style={{width:'60%', height:55, justifyContent:'center', marginTop:'15%', borderRadius:5, backgroundColor:'indigo'}}
                labelStyle={{fontSize:15, fontFamily:'sans-serif-medium' , color:'white'}}
                icon="account-check"
                mode="contained" 
                uppercase={true}
                loading={props.loading}
                disabled={props.disable}
                onPress={()=>{verifyCode()}}>
                
                    Verify
            </Button>

                
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    root: {
        width:'100%',
        flex: 1, 
        alignItems:'center',
        borderWidth:0,
    },
    title: {
        textAlign: 'center', 
        fontSize: 20,
        width:'90%',
        color:'#e5be1a', 
        fontFamily:'sans-serif-medium', 
        fontWeight:'bold'
    },
    codeFieldRoot: {
        marginTop: '20%',
        width:'70%'
    },
    cell: {
      width: 40,
      height: 40,
      fontSize: 25,
      borderBottomWidth:2,
      borderColor: 'darkgray',
      textAlign: 'center',
      color:'#FFF',
      fontWeight:'bold'
    },
    focusCell: {
      borderColor: '#FFF',
    },
  });