import React from "react";
import { useState , useEffect, useContext} from 'react';
import {View , StyleSheet , Text , TouchableOpacity, KeyboardAvoidingView, ImageBackground, ToastAndroid, BackHandler, Image} from 'react-native';
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

//otg screen component
import OtgScreen from "./OtgCodeScreen";

//For sending email

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
    
    //For Otg Code
    const [sendCode , setSendCode] = useState(false);
    const [otgCode, setOtgCode] = useState('');

    async function verifyCode(){
        if(username!=""){
            if(email!==""){
                let LowerEmail = email.toLowerCase();
                LowerEmail = LowerEmail.replace(/\s/g, '');
                if(password.length>3){
                    if(password===rePassword){

                        
                        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
                        if (reg.test(LowerEmail) === false){
                            showToastWithGravity("Email is Not Correct");
                            return false;

                        }else{

                            // showToastWithGravity("Loading...");

                            let code = Math.floor(Math.random()*90000) + 10000;
                            code = code.toString();
                            try{
                                setLoading(true); setDisable(true);

                                const response = await Api.post('/sendOtgEmail' , { "email":LowerEmail , "code":code});

                                if(response.data){
                                    showToastWithGravity("Verification code sent");
                                    setLoading(false); setDisable(false);
                                    setOtgCode(code);
                                    setSendCode(true)
                                }
                                setLoading(false); setDisable(false);

                                

                            }catch(err){ 
                                setLoading(false); setDisable(false);
                                console.log(err.response.data.error)
                                showToastWithGravity(err.response.data.error)
                            }  
                            
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
    
    const showToastWithGravity = (msg) => {
        ToastAndroid.showWithGravity(
          msg,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
    };

    async function signUp(){
        // if(username!=""){
        //     if(email!==""){
        //         let LowerEmail = email.toLowerCase();
        //         LowerEmail = LowerEmail.replace(/\s/g, '');
        //         if(password.length>3){
        //             if(password===rePassword){

            try{
                let LowerEmail = email.toLowerCase();
                LowerEmail = LowerEmail.replace(/\s/g, '');
                showToastWithGravity("Loading...");
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
                console.log(err.response.data.error)
                showToastWithGravity(err.response.data.error)
            }   
  
        //             }else{
        //                 return showToastWithGravity('Password not Matched!')
        //             }
        //         }else{
        //             return showToastWithGravity('Short Password')
        //         }
        //     }else{
        //         return showToastWithGravity('Please type Email?')
        //     }
        // }else{
        //     return showToastWithGravity('Please type Username')
        // }
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


    const theme = {
        roundness: 10,
        colors: {
          primary: 'indigo',
        },
      };

    return(
        <View style={styles.container}>
            {!sendCode ? 
            
                <View style={{width:'100%', height:'100%', alignItems:'center'  , borderColor:'black' , borderRadius:50 , borderWidth:0}}>
                    <Text style={{marginBottom:10, fontSize:20, color:'#e5be1a', fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>CREATE ACCOUNT!</Text>

                    <TextInput
                        style={{fontSize:14, width:'90%', backgroundColor:'#ede3ff', marginBottom:5}}
                        mode="outlined"
                        label="Username"
                        placeholder="Type username"
                        left={<TextInput.Icon name="account" color={(isTextInputFocused)=> isTextInputFocused ? "indigo" : "gray"  }/>}
                        onChangeText={(text)=>{setUsername(text)}}
                        theme={theme}
                        />
                    <TextInput
                        style={{fontSize:14, width:'90%', backgroundColor:'#ede3ff', marginBottom:5}}
                        mode="outlined"
                        label="Email"
                        placeholder="Type email"
                        left={<TextInput.Icon name="email" color={(isTextInputFocused)=> isTextInputFocused ? "indigo" : "gray"  }/>}
                        onChangeText={(text)=>{setEmail(text)}}
                        theme={theme}
                        />
                    <TextInput
                        style={{fontSize:14, width:'90%', backgroundColor:'#ede3ff', marginBottom:5}}
                        mode="outlined"
                        label="Password"
                        placeholder="Type password"
                        secureTextEntry={securePass}
                        left={<TextInput.Icon name="eye" onPress={()=>{setSecurePass(!securePass)}} color={(isTextInputFocused)=> isTextInputFocused ? "indigo" : "gray"  }/>}
                        onChangeText={(text)=>{setPassword(text)}}
                        theme={theme}
                        />
                    <TextInput
                        style={{fontSize:14, width:'90%', backgroundColor:'#ede3ff', marginBottom:5}}
                        mode="outlined"
                        label="Password"
                        placeholder="Type password again"
                        secureTextEntry={secureRePass}
                        left={<TextInput.Icon name="eye" onPress={()=>{setSecureRePass(!secureRePass)}} color={(isTextInputFocused)=> isTextInputFocused ? "indigo" : "gray"  }/>}
                        onChangeText={(text)=>{setRePassword(text)}}
                        theme={theme}
                        />

                    <Button 
                        style={{width:'60%', height:55, justifyContent:'center', borderRadius:5, marginTop:20, backgroundColor:'indigo'}}
                        labelStyle={{fontSize:15 , color:'white', fontWeight:'bold'}}
                        icon="account"
                        mode="contained" 
                        uppercase={true}
                        loading={loading}
                        disabled={disable}
                        onPress={() => verifyCode()}>
                        
                            Sign Up
                    </Button>

                    <View style={{marginTop:15, paddingHorizontal:25 , alignItems:'center', flexDirection:'row'}} >
                        <Text style={{fontSize:14, color:'#FFF', fontFamily:'sans-serif-medium'}}>Already have account?</Text>
                        <Text style={{fontSize:17, fontWeight:'bold', color:'#e5be1a', fontFamily:'sans-serif-medium'}} onPress={()=>navigation.dispatch(StackActions.replace('SignInScreen'))}>  Sign In</Text>
                    </View>

                    <View style={{bottom:0, right:-150}}>
                        <Image 
                            source={require('../Animations/signupGif.gif')}  
                            style={{width:200 , height:200,  transform: [{ rotate: "-30deg" }]}}
                        />      
                    </View>
                </View>
                :
                <View style={{width:'100%', height:'70%', alignItems:'center'  , borderColor:'black' , borderRadius:50 , borderWidth:0}}>
                    <OtgScreen email={email} otgCode={otgCode} signUp={()=> signUp()} loading={loading} disable={disable} setSendCode={setSendCode}/>
                </View>
            }
            
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#f1f1f1',
        backgroundColor:'#7C56C3',
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