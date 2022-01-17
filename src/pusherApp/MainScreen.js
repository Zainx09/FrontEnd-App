import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import Login from './login';
import PusherApp from './PusherApp';

export default MainScreen = () => { 
    
    // handleSubmitName = onSubmitName.bind(this); 

    const [login , setLogin] = useState({
        'hasName': false
    })
    

    const onSubmitName=(e)=>{ 
        const name = e.nativeEvent.text;
        // alert(e.nativeEvent.text)
        setLogin({
            'name':name , 
            'hasName': true
        })
        
    }

    
    return (
        <>
            {login.hasName ? <PusherApp name={login.name} /> : <Login onSubmitName={ onSubmitName } />}
        </>
        
    );
}
 