import 'react-native-gesture-handler';
import React , {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View , TouchableOpacity, BackHandler, Image, FlatList, Dimensions, LayoutAnimation, Platform, UIManager, ToastAndroid} from 'react-native';
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

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

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
    name:'SETTINGS',
    title: '',
    src:require('../Animations/Extras.gif'),
    btnText:"Settings",
    screen:'settings'
  },
];

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth*(94/100);
const cardMargin = windowWidth*(3/100);

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

     ///////////Swipe Gesture//////////////////////////
     function swipeLeft(){
      if(bottomButton === 'user'){
        setBottomButton('robot')
        listViewRef.scrollToIndex({index:1 , animated: true });
        return;
      }
      else if (bottomButton === 'robot'){
        setBottomButton('settings')
        listViewRef.scrollToIndex({index:2 , animated: true });
        return;
      }
      else if (bottomButton === 'settings'){
        return;
      }
  }

  function swipeRight(){
    if(bottomButton === 'user'){
      return;
    }
    else if (bottomButton === 'robot'){
      setBottomButton('user')
      listViewRef.scrollToIndex({index:0 , animated: true });
      return;
    }
    else if (bottomButton === 'settings'){
      setBottomButton('robot')
      listViewRef.scrollToIndex({index:1 , animated: true });
      return;
    }
  }
  ///////////Swipe Gesture//////////////////////////



    function bottomButtonClicked(button){
      if(button === 'user'){
        setBottomButton('user')
        listViewRef.scrollToIndex({index:0 , animated: true });
      }else if(button === 'robot'){
        setBottomButton('robot')
        listViewRef.scrollToIndex({index:1 , animated: true });
      }else if(button === 'settings'){
        setBottomButton('settings')
        listViewRef.scrollToIndex({index:2 , animated: true });
      }
    }

    const Item = ({ name, title, src, btnText, screen }) => (
      <View style={{width:cardWidth , height:'100%', backgroundColor:'white',  borderRadius:20, borderWidth:0, borderColor:'#045257', alignItems:'center', justifyContent:'space-evenly', marginHorizontal:cardMargin}}>
        <Text style={[styles.textStyle , {fontWeight:'bold', color:'#0d6e75', fontSize:18}]}>{name}</Text>
        <Image 
          source={src}  
          style={{width:'50%', height:'40%'}}
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

    const showToastWithGravity = (msg) => {
      ToastAndroid.showWithGravity(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    };

    const [greeting , setGreeting] = useState('')
    const [timeIcon , setTimeIcon] = useState('')
    useEffect(()=>{
      let today = new Date();

       
        let hr = today.getHours();

        if(hr>6 && hr<12){
          setGreeting('Good Morning, ')
          setTimeIcon("weather-sunset")
        }else if(hr>12 && hr<16){
          setGreeting('Good Afternoon, ')
          setTimeIcon("weather-sunny")
        }else if(hr>16 && hr<20){
          setGreeting('Good Evening, ')
          setTimeIcon("weather-sunset")
        }else{
          setGreeting('Good Night, ')
          setTimeIcon("moon-waning-crescent")
        }

    },[])

    return (

      <View style={{flex:1 , alignItems:'center' , justifyContent:'space-between', backgroundColor:'lightgray'}}>
        <View style={{width:'95%' , height:'10%', paddingTop:5, marginBottom:5, backgroundColor:'white', borderBottomRightRadius:20, borderBottomLeftRadius:20, borderWidth:0, borderColor:'#045257', alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
          <MIcon 
              name={timeIcon}
              size={28} 
              color="#0d6e75" />
          <Text style={[styles.textStyle , {fontWeight:'bold', color:'#0d6e75', fontSize:20, marginLeft:10}]}>{greeting+userData.username +" !"}</Text>
        </View>

        <GestureRecognizer 
          onSwipeLeft={() => swipeLeft()}
          onSwipeRight={() => swipeRight()}
          config={{velocityThreshold: 0.1, directionalOffsetThreshold: 20}}
          style={{height:'73%'}}>
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
        </GestureRecognizer>
        
        <View style={{flexDirection:'row', width:80 , justifyContent:'space-around'}}>
          <MIcon 
            name='circle'
            size={bottomButton==='user'? 12 : 8} 
            color={bottomButton==='user'? "#045257" : 'gray'} />
          <MIcon 
            name='circle'
            size={bottomButton==='robot'? 12 : 8} 
            color={bottomButton==='robot'? "#045257" : 'gray'}/>
          <MIcon 
            name='circle'
            size={bottomButton==='settings'? 12 : 8} 
            color={bottomButton==='settings'? "#045257" : 'gray'} />
        </View>

        <View style={{width:'95%' , height:'11%', paddingBottom:5, flexDirection:'row', backgroundColor:'white', borderRadius:0, borderWidth:0, borderColor:'#045257', alignItems:'center', justifyContent:'center', borderTopLeftRadius:20, borderTopRightRadius:20}}>

            <TouchableOpacity 
              style={styles.bottomButtons}
              onPress={()=>{bottomButtonClicked('user')}}
              >
              <MIcon 
                name="cellphone" 
                size={bottomButton==='user'? 30 : 25} 
                color={bottomButton==='user'? "#045257" : 'gray'} />
              
              <Text style={bottomButton==='user'? styles.bottomText2 : styles.bottomText}>User End</Text>
            
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bottomButtons}
              onPress={()=>{bottomButtonClicked('robot')}}
              >

              <Icon 
                name="robot" 
                size={bottomButton==='robot'? 30 : 25} 
                color={bottomButton==='robot'? "#045257" : 'gray'}/>
              
              <Text style={bottomButton==='robot'? styles.bottomText2 : styles.bottomText}>Robot End</Text>

            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bottomButtons}
              onPress={()=>{bottomButtonClicked('settings')}}
              >

              <IIcon 
                name="settings" 
                size={bottomButton==='settings'? 30 : 25} 
                color={bottomButton==='settings'? "#045257" : 'gray'} />
                
              <Text style={bottomButton==='settings'? styles.bottomText2 : styles.bottomText}>Settings</Text>

            </TouchableOpacity> 

        </View>

      </View>
    );

}

const styles = StyleSheet.create({

  buttonStyle:{
    width:'60%', 
    height:55, 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#0d6e75', 
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
    fontSize:15,
    fontFamily:'sans-serif-medium',
    textAlign:'center',
    fontWeight:'bold'
  },
  bottomButtons:{
    width:'30%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',

  },
  bottomText:{
    color:'gray',
    textAlign:'center',
    fontSize:12,
    marginTop:3
  },
  bottomText2:{
    textAlign:'center',
    fontSize:16,
    fontWeight:'bold',
    color:'#045257',
    marginTop:3
  }
})
