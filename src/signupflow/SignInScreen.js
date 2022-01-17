import React from "react";
import {View , StyleSheet , Text , Button, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import Api from '../api/Api'
import { useState } from 'react';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//It is used add padding top and botton of our view 
import { SafeAreaView } from 'react-native-safe-area-context';

const SignInScreen=({navigation})=>{

    
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')

    //email: 'testkk@test.com',
    //password: 'Password123'

    //abcd@gmail.com
    //12345


    async function signInReq(){

        try{
            console.log('Sent');
            if(email!=="" || password!==""){
                const response = await Api.post('/signin' , { email , password });
                
                await AsyncStorage.setItem('token', response.data.token)
                console.log('TOKEN = ',response.data.token)

                navigation.dispatch(
                StackActions.replace('MainFlow'))

            }else{
                alert('Please Type Correct Email or Passward!')
            }
        }catch(err){
            console.log(err.response.data);
        }        
    }

    // function signIn(){
    //     navigation.dispatch(
    //     StackActions.replace('MainFlow'))
    // }

    return(
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={{margin:30}}>
            <Text style={{marginBottom:10, alignSelf:'center', fontSize:20, fontWeight:'bold', color:'midnightblue'}}>Sign In</Text>
                
                <TextInput
                    keyboardType="email-address"
                    style={styles.inputStyle}
                    placeholder="Email"
                    onChangeText={(text)=>{setEmail(text)}}
                    />

                <TextInput
                    style={styles.inputStyle}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text)=>{setPassword(text)}}
                    />
            </View>

            <View style={{marginHorizontal:20 , alignItems:'center',justifyContent:'space-between'}}>
                <TouchableOpacity
                    style={{backgroundColor:'midnightblue', height:45, paddingHorizontal:40 , justifyContent:'center'}}
                    onPress={()=>signInReq()}>
                    
                    <Text style={{fontSize:12, fontWeight:'bold', color:'white'}}>Sign In</Text>
                </TouchableOpacity>
                
                <View style={{marginTop:5, paddingHorizontal:25 , alignItems:'center', flexDirection:'row'}} >
                    <Text style={{fontSize:13, color:'black'}}>Create Account?</Text>
                    <Text style={{fontSize:14, fontWeight:'bold', color:'midnightblue'}} onPress={()=>navigation.navigate('SignUpScreen')}>    Sign Up</Text>
                </View>
                
                {/* <Button title="Go to Sign In" onPress={()=>navigation.navigate('SignUpScreen')}></Button> */}
            </View>
        </KeyboardAvoidingView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'mintcream',
        paddingTop: 30
    },

    inputStyle:{
        marginVertical:10,
        paddingHorizontal:10,
        height: 45, 
        borderColor: 'midnightblue', 
        borderWidth: 1
    }
});


export default SignInScreen;