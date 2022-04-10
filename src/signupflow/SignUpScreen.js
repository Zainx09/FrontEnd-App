import React from "react";
import { useState , useEffect, useContext} from 'react';
import {View , StyleSheet , Text , TouchableOpacity, KeyboardAvoidingView, ImageBackground, ToastAndroid, BackHandler} from 'react-native';
import Api from '../api/Api'
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//It is used add padding top and botton of our view 
import { SafeAreaView } from 'react-native-safe-area-context';

//React Native paper
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';

//images
const backgroundImage = { 
    uri: "https://images.unsplash.com/photo-1561589959-7304f96ce3d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80"
};

import { AllContext } from '../../App';

const SignUpScreen=({navigation})=>{

    //useContext for user data
    const {UserData} = useContext(AllContext);
    const [userData, setUserData] = UserData;

    //for Button
    const [loading , setLoading] = useState(false);
    const [disable , setDisable] = useState(false);

    //for password
    const [securePass , setSecurePass] = useState(true)
    const [secureRePass , setSecureRePass] = useState(true)

    const[username, setUsername] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[rePassword , setRePassword] = useState('')

    const [token , setToken] = useState('')
    
    const showToastWithGravity = (msg) => {
        ToastAndroid.showWithGravity(
          msg,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      };

    async function signUp(){
        if(username!=""){
            if(email!==""){
                let LowerEmail = email.toLowerCase();
                if(password.length>3){
                    if(password===rePassword){

                        try{
                            console.log('Sent');
                            setLoading(true); setDisable(true);
                            
                            const response = await Api.post('/signup' , { username , "email":LowerEmail , password });

                            if(response.data){
                                
                                setToken(response.data.token)

                                await AsyncStorage.setItem('token', response.data.token)

                                setUserData({
                                    "email" : LowerEmail,
                                    "username" : username
                                })
                                
                                setLoading(false); setDisable(false);
                                navigation.dispatch(
                                StackActions.replace('HomePageScreen'))
                            }else{
                                
                                setLoading(false); setDisable(false);
                                showToastWithGravity('Not Responding')
                            }
                            

                        }catch(err){
                            setLoading(false); setDisable(false);
                            showToastWithGravity("Something went wrong!")
                        }   
  
                    }else{
                        return showToastWithGravity('Password not Matched!')
                    }
                }else{
                    return showToastWithGravity('Short Password')
                }
            }else{
                return showToastWithGravity('Please type Email?')
            }
        }else{
            return showToastWithGravity('Please type Username')
        }
    }


    const backAction = () => {

        BackHandler.exitApp();
        return true;
    };

    useEffect(() => {
    
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);


    return(
        // <View style={styles.container}>
            <ImageBackground source={require("../Animations/SignUpBg.gif")} resizeMode="cover" style={styles.container}>
                <View style={{width:'90%', alignItems:'center'  , borderColor:'darkgray' , borderRadius:2}}>
                    <Text style={{marginBottom:10, fontSize:20, color:'#340683', fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Create Account!</Text>

                    <TextInput
                        style={{fontSize:14, width:'100%', backgroundColor:'white', marginBottom:5}}
                        mode="outlined"
                        label="Username"
                        placeholder="Type username"
                        left={<TextInput.Icon name="account"/>}
                        onChangeText={(text)=>{setUsername(text)}}
                        />
                    <TextInput
                        style={{fontSize:14, width:'100%', backgroundColor:'white', marginBottom:5}}
                        mode="outlined"
                        label="Email"
                        placeholder="Type email"
                        left={<TextInput.Icon name="email"/>}
                        onChangeText={(text)=>{setEmail(text)}}
                        />
                    <TextInput
                        style={{fontSize:14, width:'100%', backgroundColor:'white', marginBottom:5}}
                        mode="outlined"
                        label="Password"
                        placeholder="Type password"
                        secureTextEntry={securePass}
                        left={<TextInput.Icon name="eye" onPress={()=>{setSecurePass(!securePass)}}/>}
                        onChangeText={(text)=>{setPassword(text)}}
                        />
                    <TextInput
                        style={{fontSize:14, width:'100%', backgroundColor:'white', marginBottom:5}}
                        mode="outlined"
                        label="Re-password"
                        placeholder="Type password"
                        secureTextEntry={secureRePass}
                        left={<TextInput.Icon name="eye" onPress={()=>{setSecureRePass(!secureRePass)}}/>}
                        onChangeText={(text)=>{setRePassword(text)}}
                        />

                    <Button 
                        style={{width:'70%', height:50, justifyContent:'center', borderRadius:8, marginTop:20}}
                        labelStyle={{fontSize:13}}
                        icon="account"
                        mode="contained" 
                        loading={loading}
                        disabled={disable}
                        onPress={() => signUp()}>
                        
                            Sign Up
                    </Button>

                    <View style={{marginTop:15, paddingHorizontal:25 , alignItems:'center', flexDirection:'row'}} >
                        <Text style={{fontSize:13, color:'black', fontFamily:'sans-serif-medium'}}>Already have account?</Text>
                        <Text style={{fontSize:14, fontWeight:'bold', color:'#340683', fontFamily:'sans-serif-medium'}} onPress={()=>navigation.dispatch(StackActions.replace('SignInScreen'))}>  Sign In</Text>
                    </View>
                </View>
            </ImageBackground>
        // </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        paddingTop:40,
        alignItems:'center',
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