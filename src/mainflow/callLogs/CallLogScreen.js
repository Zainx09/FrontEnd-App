import 'react-native-gesture-handler';
import React from 'react';
import { useState, useEffect , useContext} from 'react';
import { StyleSheet, Text, TouchableOpacity,View, ToastAndroid, FlatList, ActivityIndicator } from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome5';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Api from '../../api/Api';

//RN Paper
import { TextInput, Button } from 'react-native-paper';

import { AllContext } from '../../../App';
import { json } from 'mathjs';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

//AsyncStorage.removeItem('userId');
export default function CallLogScreen({navigation}){
   

    //useContext for user data
    const {UserData} = useContext(AllContext);
    const [userData, setUserData] = UserData;

    const [logsData , setLogsData] = useState([])
    const [createLogData , setCreateLogData] = useState([])
    const [joinLogData , setJoinLogData] = useState([])

    const [screenLoader , setScreenLoader] = useState(true);

    const [logType , setLogType] = useState("ALL")

    const showToastWithGravity = (msg) => {
        ToastAndroid.showWithGravity(
          msg,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      };

    async function getUserData(){
        try{
            const response = await Api.get('/callLog/'+userData.email);
            
            if(response.data){
                let allLogs = 
                setLogsData(response.data.reverse())
                setScreenLoader(false);
            }else{
                setScreenLoader(false);
            }
            
        }catch(err){
            setScreenLoader(false);
            showToastWithGravity('Something went wrong!;')
        }
    }
 
    function seperateLog(){
        if(logsData){
            let data = logsData.filter(function(item){
                return item.CreatorEmail === userData.email;
            })

            let data2 = logsData.filter(function(item){
                return item.ReceiverEmail === userData.email;
            })
            setCreateLogData(data);
            setJoinLogData(data2);



        }
        
    }


    ///////////Swipe Gesture//////////////////////////
    function swipeLeft(){
        if(logType === 'ALL'){
            setLogType('CREATE');
            return;
        }
        else if (logType === 'CREATE'){
            setLogType('JOIN');
            return;
        }
        else if (logType === 'JOIN'){
            return;
        }
    }

    function swipeRight(){
        if(logType === 'ALL'){
            return;
        }
        else if (logType === 'CREATE'){
            setLogType('ALL');
            return;
        }
        else if (logType === 'JOIN'){
            setLogType('CREATE');
            return;
        }
    }


    ///////////Swipe Gesture//////////////////////////

    useEffect(()=>{
        getUserData();
       
    },[])

    useEffect(()=>{
        seperateLog();
    },[logsData])

    

    const Item = ({ CreatorEmail, ReceiverEmail, CreateDate, ReceiveDate }) => (
        <View style={{flexDirection:'row', marginVertical:5 , padding:15,  backgroundColor:'white', borderRadius:5}}>

            <View>

                <View style={{flexDirection:'row' , alignItems:'center'}}>

                    <MIcon 
                        name="email" 
                        size={15} 
                        color={'gray'} />

                    { ReceiverEmail === userData.email ? 
                        CreatorEmail === userData.email ? 
                            <Text style={[styles.textStyle , {fontSize:14, color:'black'}]}>{ "You created and joined!"}</Text>
                            :
                            <Text style={[styles.textStyle , {fontSize:14, color:'black'}]}>{CreatorEmail + " created!"}</Text>
                        :
                        <Text style={[styles.textStyle , {fontSize:14, color:'black'}]}>{ReceiverEmail ? ReceiverEmail + " joined!" : "You created the call!"}</Text>
                    }
                    
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <MIcon 
                        name="call-made" 
                        size={18} 
                        color={ReceiveDate != "" ? 'green' : 'red'} />

                    <Text style={styles.textStyle}>{"Created at : "+    CreateDate}</Text>
                </View>                

                {ReceiveDate != "" && 
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <MIcon 
                            name="call-received" 
                            size={18} 
                            color={'green'} />

                        <Text style={styles.textStyle}>{"Received at : "+ReceiveDate}</Text>
                    </View>
                }
            </View>
        </View>
      );

    const renderItem = ({ item }) => {

            return(
                <Item 
                    CreatorEmail={item.CreatorEmail}
                    ReceiverEmail={item.ReceiverEmail}
                    CreateDate={item.CreateDate} 
                    ReceiveDate={item.ReceiveDate} 
                />
            )
        };


    return (
        <View style={styles.container}>

            <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'space-evenly', paddingBottom:10, backgroundColor:'white', borderRadius:15}}>
                <TouchableOpacity 
                    style={[styles.logBtn , logType==='ALL' && {borderColor:'darkgreen', borderBottomWidth:4}]}
                    onPress={()=>{setLogType("ALL")}}>

                    <Text style={[styles.logBtnTxt , logType==='ALL' && {color:'darkgreen', fontSize:13, fontWeight:'bold'}]}>All</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.logBtn , logType==='CREATE' && {borderColor:'darkgreen', borderBottomWidth:4}]}
                    onPress={()=>{setLogType("CREATE")}}> 

                    <Text style={[styles.logBtnTxt , logType==='CREATE' && {color:'darkgreen', fontSize:13, fontWeight:'bold'}]}>Create</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.logBtn , logType==='JOIN' && {borderColor:'darkgreen', borderBottomWidth:4}]}
                    onPress={()=>{setLogType("JOIN")}}>

                    <Text style={[styles.logBtnTxt , logType==='JOIN' && {color:'darkgreen', fontSize:13, fontWeight:'bold'}]}>Join</Text>
                </TouchableOpacity>
            </View>

            {screenLoader ?
                <View style={{height:'90%' , width:'100%' , justifyContent:'center' , alignItems:'center'}}>
                    <ActivityIndicator size="large" color="darkgreen" /> 
                </View>
                
            :
                <GestureRecognizer 
                    onSwipeLeft={() => swipeLeft()}
                    onSwipeRight={() => swipeRight()}
                    config={{velocityThreshold: 0.1, directionalOffsetThreshold: 20}}
                    style={{width:'100%', maxHeight:'90%'}}>
                    {logType === 'ALL' && 
                        <FlatList
                            inverted={false}
                            data={logsData}
                            renderItem={renderItem}
                            keyExtractor={item => item._id}
                        />
                    }
                    {logType === 'CREATE' && 
                        <FlatList
                            inverted={false}
                            data={createLogData}
                            renderItem={renderItem}
                            keyExtractor={item => item._id}
                        />
                    }
                    {logType === 'JOIN' && 
                        <FlatList
                            inverted={false}
                            data={joinLogData}
                            renderItem={renderItem}
                            keyExtractor={item => item._id}
                        />
                    }
                </GestureRecognizer>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin:10,
      marginTop:15,
      
    },
    textStyle:{
        color:'gray', 
        fontSize:11,
        fontFamily:'sans-serif-medium',
        fontWeight:'bold'
    },
    logBtn:{
        borderBottomWidth:1,
        width:'30%',
        alignItems:'center' , 
        justifyContent:'center'
    },
    logBtnTxt:{
        paddingVertical:10, 
        fontSize:12,
        fontFamily:'sans-serif-medium',
        color:'black'
    }
    
  });

