import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import Ably from "ably";

var ably = new Ably.Realtime('7UqRSw._t6IsA:5xcyQrZpFm7Vj2DYnW_lWoBQ-_sBrRQcG5Na3ilDRNo');
var channel = ably.channels.get('test');

export default function WebSocketScreen() {

    const[msg , setMsg] = React.useState("")

    function sendmsg(txt){
        channel.publish('greeting', txt);

        
    }

    React.useEffect(()=>{
        channel.subscribe('greeting', function(message) {
            // console.log(message.data);
            setMsg(message.data)
          });
    },[])
    

    // React.useEffect(()=>{
        
    // },[])

    return(
        <>
            <Text>ABLY</Text>
            <Button title='Press' onPress={()=>{sendmsg('zain')}}></Button>
            <Text>{msg}</Text>
        </>
    )
//   const [serverState, setServerState] = React.useState('Loading...');
//   const [messageText, setMessageText] = React.useState('');
//   const [disableButton, setDisableButton] = React.useState(true);
//   const [inputFieldEmpty, setInputFieldEmpty] = React.useState(true);
//   const [serverMessages, setServerMessages] = React.useState([]);
//   var ws = React.useRef(new WebSocket('ws://w567l.sse.codesandbox.io/')).current;


//   React.useEffect(() => {
//     const serverMessagesList = [];
//     ws.onopen = () => {
//       setServerState('Connected to the server')
//       setDisableButton(false);
//     };
//     ws.onclose = (e) => {
//       setServerState('Disconnected. Check internet or server.')
//       setDisableButton(true);
//     };
//     ws.onerror = (e) => {
//       setServerState(e.message);
//     };
//     ws.onmessage = (e) => {
//         console.log(e)
//     //   serverMessagesList.push(e.data);
//     //   setServerMessages([...serverMessagesList])
//     };
//   }, [])
//   const submitMessage = (txt) => {
//     ws.send(txt);
//     // setMessageText('')
//     // setInputFieldEmpty(true)
//   }
//   return (
//    <>
//     <Text>Web Socket</Text>
//     <Button title='SEND' onPress={()=>submitMessage("hello World")}></Button>
//    </>
//   );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingTop: 30,
    padding: 8,
  },

});