import React from "react";
import { useState , useEffect, useContext} from 'react';
import {View , StyleSheet , Text , TouchableOpacity, KeyboardAvoidingView, ToastAndroid, ImageBackground, BackHandler, Image} from 'react-native';
import Api from '../api/Api'
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//It is used add padding top and botton of our view 
import { SafeAreaView } from 'react-native-safe-area-context';

//RN Paper
import { TextInput, Button } from 'react-native-paper';

//images
const backgroundImage = { 
    uri: "https://images.unsplash.com/photo-1561589959-7304f96ce3d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80"
};

import { AllContext } from '../../App';

const SignInScreen=({navigation})=>{

    //useContext for user data
    const {UserData} = useContext(AllContext);
    const [userData, setUserData] = UserData;

    //for Button
    const [loading , setLoading] = useState(false);
    const [disable , setDisable] = useState(false);

    //for password
    const [securePass , setSecurePass] = useState(true)

    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('');

    const showToastWithGravity = (msg) => {
        ToastAndroid.showWithGravity(
          msg,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
    };


    async function signInReq(){

        try{
            if(email!=="" || password!==""){
                let LowerEmail = email.toLowerCase();
                LowerEmail = LowerEmail.replace(/\s/g, '');
                console.log('Sent');
                setLoading(true); setDisable(true);

                const response = await Api.post('/signin' , { "email":LowerEmail , password });
                
                
                if(response.data){

                    await AsyncStorage.setItem('token', response.data.token)

                    setLoading(false); setDisable(false);

                    setUserData({
                        "email" : LowerEmail,
                        "username" : response.data.user.username
                    })

                    navigation.dispatch(
                    StackActions.replace('HomePageScreen'))
                }else{
                    setLoading(false); setDisable(false);
                    showToastWithGravity('Not Responding')
                }
                

            }else{
                showToastWithGravity('Please Type Correct Email or Passward!')
            }
        }catch(err){
            setLoading(false); setDisable(false);
            showToastWithGravity("Something went wrong!")
            console.log("error : ",err.response.data);
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

    const theme = {
        roundness: 10,
        colors: {
          primary: 'indigo',
        },
      };

    return(
        <View style={styles.container}>
        {/* // <ImageBackground source={require("../Animations/SignUpBg.gif")} resizeMode="cover" style={styles.container}> */}
            <View style={{width:'100%', alignItems:'center' , borderWidth:0}}>
                <Text style={{marginBottom:10, alignSelf:'center', fontSize:18, fontFamily:'sans-serif-medium', fontWeight:'bold', color:'#e5be1a'}}>LOG IN</Text>
                
                <TextInput
                    style={{width:'90%', fontSize:14, marginBottom:10, fontFamily:'sans-serif-medium', backgroundColor:'#ede3ff'}}
                    mode="outlined"
                    label="Email"
                    placeholder="Type email"
                    left={<TextInput.Icon name="email" color={(isTextInputFocused)=> isTextInputFocused ? "indigo" : "gray"  }/>}
                    onChangeText={(text)=>{setEmail(text)}}
                    theme={theme}
                    />
                <TextInput
                    style={{width:'90%', fontSize:14, fontFamily:'sans-serif-medium', backgroundColor:'#ede3ff'}}
                    mode="outlined"
                    label="Password"
                    placeholder="Type password"
                    secureTextEntry={securePass}
                    left={<TextInput.Icon name="eye" onPress={()=>{setSecurePass(!securePass)}} color={(isTextInputFocused)=> isTextInputFocused ? "indigo" : "gray"  }/>}
                    onChangeText={(text)=>{setPassword(text)}}
                    theme={theme}
                    />
            

                <Button 
                    style={{width:'60%', height:55, justifyContent:'center', borderRadius:5, marginTop:40, backgroundColor:'indigo'}}
                    labelStyle={{fontSize:15, fontFamily:'sans-serif-medium' , color:'white'}}
                    icon="account"
                    mode="contained" 
                    uppercase={true}
                    loading={loading}
                    disabled={disable}
                    onPress={() => signInReq()}>
                    
                        Login
                </Button>
                
                <View style={{marginTop:15, paddingHorizontal:25 , alignItems:'center', flexDirection:'row'}} >
                    <Text style={{fontSize:14, color:'#FFF', fontFamily:'sans-serif-medium'}}>Create Account?</Text>
                    <Text style={{fontSize:17, fontWeight:'bold', color:'#e5be1a', fontFamily:'sans-serif-medium'}} onPress={()=>navigation.dispatch(StackActions.replace('SignUpScreen'))}>  Sign Up</Text>
                </View>
                
            </View>

            <View style={{bottom:-50, right:-200 , borderWidth:0}}>
                <Image 
                    source={require('../Animations/signupGif.gif')}  
                    style={{width:250 , height:250,  transform: [{ rotate: "-30deg" }]}}
                />      
            </View>
        {/* </ImageBackground> */}
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#f1f1f1',
        backgroundColor:'#7C56C3',
        paddingTop: 40
    },

    inputStyle:{
        marginVertical:10,
        paddingHorizontal:10,
        backgroundColor:'#ede3ff',
        height: 45, 
        borderColor: 'midnightblue', 
        borderWidth: 1,
        color:'black'
    }
});


export default SignInScreen;