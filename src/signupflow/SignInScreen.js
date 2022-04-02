import React from "react";
import {View , StyleSheet , Text , TouchableOpacity, KeyboardAvoidingView, ToastAndroid, ImageBackground} from 'react-native';
import Api from '../api/Api'
import { useState } from 'react';
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

const SignInScreen=({navigation})=>{

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
                console.log('Sent');
                setLoading(true); setDisable(true);

                const response = await Api.post('/signin' , { email , password });
                
                await AsyncStorage.setItem('token', response.data.token)
                console.log('TOKEN = ',response.data.token)

                navigation.dispatch(
                StackActions.replace('HomePageScreen'))

            }else{
                showToastWithGravity('Please Type Correct Email or Passward!')
            }
        }catch(err){
            setLoading(false); setDisable(false);
            showToastWithGravity("Something went wrong!")
            console.log(err.response.data);
        }        
    }

    // function signIn(){
    //     navigation.dispatch(
    //     StackActions.replace('MainFlow'))
    // }

    return(
        <ImageBackground source={require("../Animations/SignUpBg.gif")} resizeMode="cover" style={styles.container}>
            <View style={{margin:20}}>
            <Text style={{marginBottom:10, alignSelf:'center', fontSize:20, fontWeight:'bold', color:'#340683'}}>Sign In!</Text>
                
                <TextInput
                    style={{fontSize:14, marginBottom:10}}
                    mode="outlined"
                    label="Email"
                    placeholder="Type email"
                    left={<TextInput.Icon name="email"/>}
                    onChangeText={(text)=>{setEmail(text)}}
                    />
                <TextInput
                    style={{fontSize:14}}
                    mode="outlined"
                    label="Password"
                    placeholder="Type password"
                    secureTextEntry={securePass}
                    left={<TextInput.Icon name="eye" onPress={()=>{setSecurePass(!securePass)}}/>}
                    onChangeText={(text)=>{setPassword(text)}}
                    />
            </View>

            <View style={{marginHorizontal:20 , alignItems:'center',justifyContent:'space-between'}}>
                {/* <TouchableOpacity
                    style={{backgroundColor:'midnightblue', height:45, paddingHorizontal:40 , justifyContent:'center'}}
                    onPress={()=>signInReq()}>
                    
                    <Text style={{fontSize:12, fontWeight:'bold', color:'white'}}>Sign In</Text>
                </TouchableOpacity> */}

                <Button 
                    style={{width:'50%', height:50, justifyContent:'center'}}
                    labelStyle={{fontSize:14}}
                    icon="account"
                    mode="contained" 
                    loading={loading}
                    disabled={disable}
                    onPress={() => signInReq()}>
                    
                        Sign In
                </Button>
                
                <View style={{marginTop:5, paddingHorizontal:25 , alignItems:'center', flexDirection:'row'}} >
                    <Text style={{fontSize:13, color:'black'}}>Create Account?</Text>
                    <Text style={{fontSize:14, fontWeight:'bold', color:'#340683'}} onPress={()=>navigation.dispatch(StackActions.replace('SignUpScreen'))}>  Sign Up</Text>
                </View>
                
                {/* <Button title="Go to Sign In" onPress={()=>navigation.navigate('SignUpScreen')}></Button> */}
            </View>
        </ImageBackground>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        paddingTop: 40
    },

    inputStyle:{
        marginVertical:10,
        paddingHorizontal:10,
        height: 45, 
        borderColor: 'midnightblue', 
        borderWidth: 1,
        color:'black'
    }
});


export default SignInScreen;