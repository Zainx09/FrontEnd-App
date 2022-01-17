expo init AwesomeProject

expo install expo-barcode-scanner

npm install @react-navigation/native

npm install @react-navigation/bottom-tabs

npm install @react-navigation/native-stack

npm install react-native-screens react-native-safe-area-context

expo install expo-sensors

npm i react-native-gesture-handler
npm install --save react-native-reanimated 
expo install react-native-screens
expo install react-native-elements

expo install react-native-safe-area-context


npm install axios

//Axios Documentation


//Axios In some file
import axios from 'axios'

//base url is used to connect axios to express server.
//but if we run our server on our PC then it is very difficult to connect
//so we use ngrok to connect axios and express sever
//ngrok provide a url but it will change after every 2 hours

export default axios.create({
    baseURL:' http://ec1e-39-50-168-202.ngrok.io'
});



//Now Import Axios in some other file

import trackerApi from '../api/tracker';

const response = await trackerApi.post('/signup' , { email , password });
console.log(response.data);

const response = await trackerApi.post('/signin' , { email , password });
console.log(response.data);





//async-storage to store jwt into device
npm install @react-native-async-storage/async-storage

//Documentation here
https://react-native-async-storage.github.io/async-storage/docs/usage



npm install pusher-js @react-native-community/netinfo



npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

//add code in mainactivity.java file
    import android.os.Bundle;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);
  }

npm install uuid
npm install react-native-get-random-values

npm install react-native-agora
npm i agora-rn-uikit