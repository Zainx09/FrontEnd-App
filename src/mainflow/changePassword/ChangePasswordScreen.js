import 'react-native-gesture-handler';
import React from 'react';
import { useState, useEffect , useContext} from 'react';
import { StyleSheet, Text, TouchableOpacity,View, ToastAndroid, FlatList, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Api from '../../api/Api';

//RN Paper
import { TextInput, Button } from 'react-native-paper';

import { AllContext } from '../../../App';

//AsyncStorage.removeItem('userId');
export default function ChangePasswordScreen({navigation}){
   

    //useContext for user data
    const {UserData} = useContext(AllContext);
    const [userData, setUserData] = UserData;

    const [oldPassword , setOldPassword] = useState('');
    const [newPassword , setNewPassword] = useState('');
    const [newRePassword , setNewRePassword] = useState('');

    const [secureOldPassword , setSecureOldPassword] = useState(true)
    const [secureNewPassword , setSecureNewPassword] = useState(true)
    const [secureNewRePassword , setSecureNewRePassword] = useState(true)

    const [loading , setLoading] = useState(false);
    const [disable , setDisable] = useState(false);



    const showToastWithGravity = (msg) => {
        ToastAndroid.showWithGravity(
          msg,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      };


    async function changePasswordReq(){

      
           
        if(oldPassword != "" || newPassword != "" || newRePassword != ""){
            if(newPassword===newRePassword){

                try{
                    setLoading(true); setDisable(true);
                    
                    const response = await Api.post('/changePassword' , {"email" : userData.email , "password" : oldPassword , "newPassword" : newPassword});

                    setLoading(false); setDisable(false);

                    if(response.data){
                        showToastWithGravity("Password Changed")
                        await AsyncStorage.removeItem('token');
                        navigation.dispatch(
                            StackActions.replace('SignInScreen'))
                    }                   
                }catch(err){
                    setLoading(false); setDisable(false);
                    showToastWithGravity("Can't change your Password")
                }   
            }else{
                return showToastWithGravity('New Password not matched!')
            }
        }else{
            return showToastWithGravity('Please fill empty fields.')
        }
    }

    const theme = {
        roundness: 10,
        colors: {
          primary: 'indigo',
        },
      };   

    return (
            <View style={styles.container}>

                <Text style={{color:'indigo' , fontSize:15 , fontFamily:'sans-serif-medium',fontWeight:'bold', textAlign:'center', marginBottom:'5%'}}>
                    
                    CHANGE PASSWORD
                </Text>

                <TextInput
                    style={{fontSize:13 , width:'85%', marginBottom:'7%'}}
                    mode="outlined"
                    label="Current Password"
                    placeholder="Type current Password"
                    secureTextEntry={secureOldPassword}
                    left={<TextInput.Icon name="eye" onPress={()=>{setSecureOldPassword(!secureOldPassword)}} color={(isTextInputFocused)=> isTextInputFocused ? "indigo" : "gray"  }/>}
                    onChangeText={(text)=>{setOldPassword(text)}}
                    theme={theme}
                    />
                <TextInput
                    style={{fontSize:13 , width:'85%', marginBottom:'2%'}}
                    mode="outlined"
                    label="New Password"
                    placeholder="Type new Password"
                    secureTextEntry={secureNewPassword}
                    left={<TextInput.Icon name="eye" onPress={()=>{setSecureNewPassword(!secureNewPassword)}} color={(isTextInputFocused)=> isTextInputFocused ? "indigo" : "gray"  }/>}
                    onChangeText={(text)=>{setNewPassword(text)}}
                    theme={theme}
                    />
                <TextInput
                    style={{fontSize:13 , width:'85%', marginBottom:'10%'}}
                    mode="outlined"
                    label="New Password"
                    placeholder="Type new Password again"
                    secureTextEntry={secureNewRePassword}
                    left={<TextInput.Icon name="eye" onPress={()=>{setSecureNewRePassword(!secureNewRePassword)}} color={(isTextInputFocused)=> isTextInputFocused ? "indigo" : "gray"  }/>}
                    onChangeText={(text)=>{setNewRePassword(text)}}
                    theme={theme}
                    />

                <Button 
                    style={{width:'70%', height:50, justifyContent:'center', borderRadius:5, backgroundColor:'indigo'}}
                    labelStyle={{fontSize:12, fontWeight:'600'}}
                    icon="key"
                    mode="contained" 
                    uppercase={false}
                    loading={loading}
                    disabled={disable}
                    onPress={() => changePasswordReq()}>
                    
                        Change Password
                </Button>

                
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        paddingTop:'20%',
        backgroundColor:'white'
      
    },    
  });

