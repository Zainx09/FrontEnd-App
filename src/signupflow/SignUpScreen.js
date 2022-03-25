import React from "react";
import {View , StyleSheet , Text , Button , TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import Api from '../api/Api'
import { useState } from 'react';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//It is used add padding top and botton of our view 
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUpScreen=({navigation})=>{

    const[username, setUsername] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[rePassword , setRePassword] = useState('')

    //email: 'testkk@test.com',
    //password: 'Password123'

    //abcd@gmail.com
    //12345

    const [token , setToken] = useState('')
    

    async function signUp(){
        if(username!=""){
            if(email!==""){
                if(password.length>4){
                    if(password===rePassword){


                        try{
                            console.log('Sent');
                            
                            const response = await Api.post('/signup' , { username , email , password });
                            setToken(response.data.token)

                            await AsyncStorage.setItem('token', response.data.token)
                            console.log('TOKEN = ',response.data.token)
                            
                            navigation.dispatch(
                            StackActions.replace('HomePageScreen'))

                        }catch(err){
                            alert(err.response.data)
                            console.log(err.response.data);
                        }   
  
                    }else{
                        return alert('Password not Matched')
                    }
                }else{
                    return alert('Short length')
                }
            }else{
                return alert('Where is Email?')
            }
        }else{
            return alert('Where is Username?')
        }
    }

    const placeholderColor = 'black';
    return(
        <KeyboardAvoidingView style={styles.container} behavior="padding">

            <View style={{margin:30}}>
            <Text style={{marginBottom:10, alignSelf:'center', fontSize:20, fontWeight:'bold', color:'midnightblue'}}>Create Account</Text>

                <TextInput
                    style={styles.inputStyle}
                    placeholder="Username"
                    placeholderTextColor = 'lightgray'
                    onChangeText={(text)=>{setUsername(text)}}
                    />

                <TextInput
                    keyboardType="email-address"
                    style={styles.inputStyle}
                    placeholder="Email Address"
                    placeholderTextColor = 'lightgray'
                    onChangeText={(text)=>{setEmail(text)}}
                    />

                <TextInput
                    style={styles.inputStyle}
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor = 'lightgraylightgray'
                    onChangeText={(text)=>{setPassword(text)}}
                    />

                <TextInput
                    style={styles.inputStyle}
                    placeholder="Re-Password"
                    secureTextEntry={true}
                    placeholderTextColor = 'lightgray'
                    onChangeText={(text)=>{setRePassword(text)}}
                    />
            </View>

            <View style={{marginHorizontal:20 , alignItems:'center', justifyContent:'space-between'}}>
                <TouchableOpacity
                    style={{backgroundColor:'midnightblue', height:45, paddingHorizontal:40 , justifyContent:'center'}}
                    onPress={()=>signUp()}>
                    
                    <Text style={{fontSize:12, fontWeight:'bold', color:'white'}}>Create Account</Text>
                </TouchableOpacity>

                <View style={{marginTop:5, paddingHorizontal:25 , alignItems:'center', flexDirection:'row'}} >
                    <Text style={{fontSize:13, color:'black'}}>Already have account?</Text>
                    <Text style={{fontSize:14, fontWeight:'bold', color:'midnightblue'}} onPress={()=>navigation.dispatch(StackActions.replace('SignInScreen'))}>    Sign In</Text>
                </View>
            </View>


            {/* <Button title="check Sign Up Post Request" onPress={()=>signUpReq()}></Button> */}
            
            <Text>{token}</Text>

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
        borderWidth: 1,
        color:'#000000'

    }
});


export default SignUpScreen;