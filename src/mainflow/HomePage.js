import 'react-native-gesture-handler';
import React , {useEffect, useState} from 'react';
import { StyleSheet, Text, View , TouchableOpacity, BackHandler, Image, FlatList, Dimensions} from 'react-native';
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


export default function HomePage({navigation}){

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
      <View style={{width:cardWidth , height:'100%', backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'gray', alignItems:'center', justifyContent:'space-evenly', marginHorizontal:cardMargin}}>
        <Text style={[styles.textStyle , {fontWeight:'bold', color:'gray'}]}>{name}</Text>
        <Image 
          source={src}  
          style={{width:'40%', height:'50%'}}
        />
    
        <Text style={[styles.textStyle , {color:'gray'}]}>{title}</Text>
    
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
      // else if(command === 'logout'){
      //   await AsyncStorage.removeItem('token');
      //   navigation.dispatch(
      //     StackActions.replace('SignInScreen'))
      //   // navigation.navigate('SplashScreen')
        
      // }
    }

    return (
      
      // <View style={{flex:1, alignItems:'center' , justifyContent:'space-evenly', backgroundColor:'#ffffff'}}>

      //   <TouchableOpacity 
      //     style={styles.buttonStyle}
      //     onPress={()=>{goToScreen('userEnd')}}
      //     >
      //     <Text style={{color:'white', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>User End</Text>
      //   </TouchableOpacity>
  
  
      //   <TouchableOpacity 
      //   style={styles.buttonStyle}
      //   onPress={()=>{goToScreen('roboticEnd')}}
      //   >
      //     <Text style={{color:'white', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Robotic End</Text>
      //   </TouchableOpacity>
  
      //   <TouchableOpacity 
      //   style={[styles.buttonStyle, {height:'20%'}]}
      //   onPress={()=>{goToScreen('settings')}}
      //   >
      //     <Text style={{color:'white', fontSize:20 , fontFamily:'sans-serif-medium' , fontWeight:'bold'}}>Settings</Text>
      //   </TouchableOpacity>
          
      // </View>


      // <View style={{flex:1, justifyContent:'space-around', alignItems:'center', backgroundColor:'lightgray'}}>
      //   <TouchableOpacity 
      //     style={styles.animationStyle} 
      //     onPress={()=>{goToScreen('userEnd')}}>
      //   <Image 
      //         source={require('../Animations/UserEnd.gif')}  
      //         style={{width:'40%', height:'80%'}}
      //       />
      //     <Text style={styles.textStyle}>USER END</Text>

      //   </TouchableOpacity>

      //   <TouchableOpacity 
      //     style={styles.animationStyle}
      //     onPress={()=>{goToScreen('roboticEnd')}}>
      //   <Image 
      //         source={require('../Animations/RoboticEnd.gif')}  
      //         style={{width:'60%', height:'80%'}}
      //       />
      //     <Text style={styles.textStyle}>ROBOTIC END</Text>

      //   </TouchableOpacity>

      //   <TouchableOpacity 
      //     style={[styles.animationStyle , {height:'23%'}]}
      //     onPress={()=>{goToScreen('settings')}}>
      //   <Image 
      //         source={require('../Animations/Extras.gif')}  
      //         style={{width:'40%', height:'80%'}}
      //       />
      //     <Text style={styles.textStyle}>EXTRAS</Text>

      //   </TouchableOpacity>

      // </View>

      <View style={{flex:1 , alignItems:'center' , justifyContent:'space-around', backgroundColor:'#f0f0f0'}}>
        <View style={{width:'90%' , height:'10%', backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'gray', alignItems:'center', justifyContent:'center'}}>
          <Text style={[styles.textStyle , {fontWeight:'bold', color:'gray', fontSize:17}]}>Hello ZAIN!</Text>
        </View>

        {/* <View style={{width:'90%' , height:'65%', backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'gray', alignItems:'center', justifyContent:'space-evenly'}}>
          <Image 
            source={bottomButton === 'user' ? require('../Animations/UserEnd.gif') 
              : bottomButton === 'robot' ? require('../Animations/RoboticEnd.gif') 
              : require('../Animations/Extras.gif') }  
            style={{width:'50%', height:'60%'}}
          />

          <Text style={[styles.textStyle , {color:'gray'}]}>{bottomButton === 'user' ? "You are using this Phone!" : bottomButton === 'robot' ? "Mount this Phone on Robotic Head!" : "Extras!"}</Text>

          <TouchableOpacity 
            style={styles.buttonStyle} 
            onPress={()=>{
              if(bottomButton==='user'){
                goToScreen('userEnd')
              }else if(bottomButton==='robot'){
                goToScreen('roboticEnd')
              }
            }}
            >
              <Text style={styles.textStyle}>Let's Start</Text>

          </TouchableOpacity>
        </View> */}

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
        

        <View style={{width:'90%' , height:'15%', flexDirection:'row', backgroundColor:'white', borderWidth:3, borderRadius:20, borderColor:'gray', alignItems:'center', justifyContent:'center'}}>

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
    width:'85%', 
    height:'14%', 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#57bec5', 
    borderWidth:4,
    borderColor:'#14a2ab',
    borderRadius:10
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
