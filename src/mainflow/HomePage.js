import 'react-native-gesture-handler';
import React , {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View , TouchableOpacity, BackHandler, Image, FlatList, Dimensions, LayoutAnimation, Platform, UIManager} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';



//RN Paper
import { Card, Button } from 'react-native-paper';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

//AsyncStorage.removeItem('userId');

const DATA = [
  {
    id: '1',
    name:'USER END',
    title: 'You are using this Phone!',
    src:require('../Animations/UserEnd.gif'),
    btnText:"Let's Start",
    screen:'userEnd'
  },
  {
    id: '2',
    name:'ROBOTIC END',
    title: 'Mount this Phone on Robotic Head!',
    src:require('../Animations/RoboticEnd.gif'),
    btnText:"Let's Start",
    screen:'roboticEnd'
  },
  {
    id: '3',
    name:'EXTRAS',
    title: '',
    src:require('../Animations/Extras.gif'),
    btnText:"Extras",
    screen:'settings'
  },
];

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth*(90/100);
const cardMargin = windowWidth*(5/100);

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental){
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import { AllContext } from '../../App';

export default function HomePage({navigation}){

    //useContext for user data
    const {UserData} = useContext(AllContext);
    const [userData, setUserData] = UserData;
    

    //Bottom Buttons
    const [bottomButton , setBottomButton] = useState('user');

    //Fltalist ref
    let listViewRef;

    function bottomButtonClicked(button){
      if(button === 'user'){
        setBottomButton('user')
        listViewRef.scrollToIndex({index:0 , animated: true });
      }else if(button === 'robot'){
        setBottomButton('robot')
        listViewRef.scrollToIndex({index:1 , animated: true });
      }else if(button === 'extras'){
        setBottomButton('extras')
        listViewRef.scrollToIndex({index:2 , animated: true });
      }
    }

    const Item = ({ name, title, src, btnText, screen }) => (
      <View style={{width:cardWidth , height:'100%', backgroundColor:'white', borderWidth:1, borderRadius:5, borderColor:'darkgray', alignItems:'center', justifyContent:'space-evenly', marginHorizontal:cardMargin}}>
        <Text style={[styles.textStyle , {fontWeight:'bold', color:'#0d6e75'}]}>{name}</Text>
        <Image 
          source={src}  
          style={{width:'40%', height:'50%'}}
        />
    
        <Text style={[styles.textStyle , {color:'#858585'}]}>{title}</Text>
    
        <TouchableOpacity 
          style={styles.buttonStyle} 
          onPress={()=>{goToScreen(screen)}}>
            <Text style={styles.textStyle}>{btnText}</Text>
        </TouchableOpacity>
      </View>
    );

    const renderItem = ({ item }) => (
      <Item 
        name={item.name}
        title={item.title} 
        src={item.src} 
        btnText={item.btnText} 
        screen={item.screen} />
    );


    

    async function goToScreen(command){
      if(command === 'userEnd'){
        navigation.navigate('UserEndScreen')
  
      }else if(command === 'roboticEnd'){
        navigation.navigate('RoboticEndScreen')
  
      }else if(command === 'settings'){
        navigation.navigate('SettingScreen')
        // navigation.navigate('SplashScreen')
        
      }
    }

    return (

      <View style={{flex:1 , alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'#f7f7f7'}}>
        <View style={{width:'90%' , height:'10%', backgroundColor:'white', borderWidth:1, borderRadius:5, borderColor:'darkgray', alignItems:'center', justifyContent:'center'}}>
          <Text style={[styles.textStyle , {fontWeight:'bold', color:'#0d6e75', fontSize:17}]}>Hello {userData.username}</Text>
        </View>

        <View style={{height:'65%'}}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            ref={(ref) => {
              listViewRef = ref;
            }}
          />
        </View>
        

        <View style={{width:'90%' , height:'15%', flexDirection:'row', backgroundColor:'white', borderWidth:1, borderRadius:5, borderColor:'darkgray', alignItems:'center', justifyContent:'center'}}>

            <TouchableOpacity 
              style={styles.bottomButtons}
              // onPress={()=>{setBottomButton('user')}}
              onPress={()=>{bottomButtonClicked('user')}}
              >
              <Text style={bottomButton==='user'? styles.bottomText2 : styles.bottomText}>User End</Text>

              <MIcon 
                name="cellphone" 
                size={bottomButton==='user'? 30 : 25} 
                color={bottomButton==='user'? "#045257" : 'gray'} />
            
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bottomButtons}
              // onPress={()=>{setBottomButton('robot')}}
              onPress={()=>{bottomButtonClicked('robot')}}
              >
              
              <Text style={bottomButton==='robot'? styles.bottomText2 : styles.bottomText}>Robot End</Text>
              <Icon 
                name="robot" 
                size={bottomButton==='robot'? 30 : 25} 
                color={bottomButton==='robot'? "#045257" : 'gray'}/>

            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bottomButtons}
              // onPress={()=>{setBottomButton('extras')}}
              onPress={()=>{bottomButtonClicked('extras')}}
              >

              <Text style={bottomButton==='extras'? styles.bottomText2 : styles.bottomText}>Extras</Text>
              <IIcon 
                name="settings" 
                size={bottomButton==='extras'? 30 : 25} 
                color={bottomButton==='extras'? "#045257" : 'gray'} />

            </TouchableOpacity> 

        </View>

      </View>
    );

}

const styles = StyleSheet.create({

  buttonStyle:{
    width:'60%', 
    height:'12%', 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#57bec5', 
    borderColor:'#14a2ab',
    borderRadius:5
  },
  animationStyle:{
    width:'95%', 
    height:'35%', 
    alignItems:'center',
    backgroundColor:'white',
    borderWidth:2,
    borderColor:'gray',
    borderRadius:60
  },
  textStyle:{
    color:'white', 
    fontSize:13,
    fontFamily:'sans-serif-medium',
    textAlign:'center',
    fontWeight:'bold'
  },
  bottomButtons:{
    width:'30%',
    height:'100%',
    alignItems:'center',
    justifyContent:'space-evenly',

  },
  bottomText:{
    color:'gray',
    textAlign:'center',
    fontSize:12
  },
  bottomText2:{
    textAlign:'center',
    fontSize:15,
    fontWeight:'bold',
    color:'#045257'
  }
})
