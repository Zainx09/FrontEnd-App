import 'react-native-gesture-handler';
import React from 'react';
import { useState, useEffect , createContext} from 'react';
import { StyleSheet, Text, TouchableOpacity,View } from "react-native";



//RN Paper
import { TextInput, Button } from 'react-native-paper';

//AsyncStorage.removeItem('userId');
export default function CallLogScreen({navigation}){


    return (
        <View style={styles.container}>

            <View style={{flexDirection:'row', width:'100%', height:'10%', borderWidth:2, alignItems:'center'}}>
                <TouchableOpacity style={{borderWidth:1, width:'33%', height:'100%', alignItems:'center' , justifyContent:'center'}}>
                    <Text style={{color:'black'}}>All</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{borderWidth:1, width:'34%', height:'100%', alignItems:'center' , justifyContent:'center'}}>
                    <Text style={{color:'black'}}>Create</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{borderWidth:1, width:'33%', height:'100%', alignItems:'center' , justifyContent:'center'}}>
                    <Text style={{color:'black'}}>Join</Text>
                </TouchableOpacity>
            </View>

            <View style={{width:'100%', height:'90%', borderWidth:2}}>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin:10
    }
  });

