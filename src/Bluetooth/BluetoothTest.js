


import React, { useEffect, useState } from 'react';
import {View, 
  StyleSheet, 
  Text, 
  TextInput, 
  KeyboardAvoidingView, 
  Button ,
  SafeAreaView,
  ScrollView, 
  FlatList,
  StatusBar, 
  PermissionsAndroid,
  NativeModules,
  NativeEventEmitter,} from 'react-native';

  import BluetoothSerial from 'react-native-bluetooth-serial-2'


  // import SerialPortAPI from 'react-native-serial-port-api';


  export default function BluetoothTest(){

    const [connected , setConnected] = useState(false);
    // useState(()=>{


    //   BluetoothSerial.on('read', (data) => {
    //     console.log("Read Data ----- ",data);
  
    //   });
    //   // BluetoothSerial.withDelimiter('\n').then(() => {
    //   //   console.log('Bluetooth subscribed with delimiter');
    //   // });

    // },[])
   
    //MI125zvri  , DelayelayCjkBRnX , DelayCjkBRnX
    async function connect(){
      try{
        await BluetoothSerial.connect("00:18:E4:40:00:06");
        console.log('Connected')
        setConnected(true);
      }catch(err){
        console.log('Error ------ ' , err)
        setConnected(false);
      }
      
    }
    

    async function write(){
      if (!connected) {
        console.log("Must be connected!!");
        return
      }
  
      BluetoothSerial.write("A")
      .then((res) => {
       console.log("Writed");
      })
      .catch((err) => Toast.showShortBottom(err.message))
    }

    async function read(){
      if(!connected){
        console.log("Must be connected!!");
        return
      }

        BluetoothSerial.readFromDevice()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));


      // BluetoothSerial.read((err, string)=>{
      //   if (err){
      //     console.log("Error --- ",err)
      //     return
      //   }
      //   console.log(string);
      // })
    }


    async function checkEN(){
      let en = await BluetoothSerial.isEnabled();

      if(en){
        let l = await BluetoothSerial.list();
        console.log(l);
      }
      
    }
    return(
      <>
        
        <Text>ABCD</Text>
        <Button title="Connect" onPress={()=>{connect()}}></Button>
        <Button title="Check EN" onPress={()=>{checkEN()}}></Button>
        <Button title="Write" onPress={()=>{write()}}></Button>
        <Button title="Read" onPress={()=>{read()}}></Button>
      </>
    )
  }









  // import {BluetoothSerial} from "@ionic-native/bluetooth-serial/index";

  // export default function BluetoothTest(){

  //   function writeData(){
  //     // string
  //     let wr = BluetoothSerial.write("hello, world", success , failure);
  //     console.log(wr)
  //   }

  //   function success(){
  //     console.log("Done")
  //   }

  //   function failure(){
  //     console.log('Fail')
  //   }

  //   function readData(){

  //     BluetoothSerial.read(function (data) {
  //       console.log(data);
  //   }, failure);

  //   }

  //   return(
  //     <>
  //       <Text>
  //         abcdddd
  //       </Text>

  //       <Button title="Write" onPress={()=>{writeData()}}></Button>
  //       <Button title="Read" onPress={()=>{readData()}}></Button>
  //       </>
  //   )
  //  }




  // import { BleManager } from 'react-native-ble-plx';
  // let manager = new BleManager();

  // export default function BluetoothTest(){ 
    

  //   function scanAndConnect() {
      
  
  //     manager.startDeviceScan(null, null, (error, device) => {
  //         if (error) {
  //             console.log("Error = ", error)
  //             // Handle error (scanning will be stopped automatically)
  //             return
  //         }
  
  //         // Check if it is a device you are looking for based on advertisement data
  //         // or other criteria.
  //         // if (device.name === 'moto e5 plus' || 
  //         //     device.name === 'OPPO F15') {
  //         //     console.log('Found');
  //             // Stop scanning as it's not necessary if you are scanning for one device.
  //             console.log(device.name);
  //             // manager.stopDeviceScan();
  
  //             // Proceed with connection.
  //         // }
  //     });
  // }

  //   useState(()=>{
      
  //     const subscription = manager.onStateChange((state) => {
  //       if (state === 'PoweredOn') {
  //           console.log("Powered ON")
  //           scanAndConnect();
  //           subscription.remove();
  //       }
  //     }, true);

  //   },[])



  //   return(
  //     <>
  //     <Text>abcd</Text>
  //     </>
  //   )
  // }


//   import RNBluetoothClassic, {
//     BluetoothEventType,
//     BluetoothDevice,
//   } from "react-native-bluetooth-classic";


// export default function BluetoothTest(){ // (1)


//     const [device , setDevice] = useState('')


//     async function requestAccessFineLocationPermission(){
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Access fine location required for discovery',
//             message:
//               'In order to perform discovery, you must enable/allow ' +
//               'fine location access.',
//             buttonNeutral: 'Ask Me Later"',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK'
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       };



//     async function checkPaired(){
//         try {
//             let paired  = await RNBluetoothClassic.getBondedDevices();
//             console.log('Check ----- ',paired)

          
//             setDevice(paired[0]);
//           } catch (err) {
//             console.log("ERROR------------pr")
//           }
//     }

//     async function checkConnectedDevs(){
//         try {
//             let con  = await RNBluetoothClassic.getConnectedDevices();
//             console.log('Check ----- ',con)
//           } catch (err) {
//             console.log("ERROR------------con Devs")
//           }
//     }

//     async function checkConnectedDev(){
//         try {
//             const address3 = "41:42:64:B8:40:97"; //Bluetooth Music
//             const address2 = "30:4B:07:2E:3C:E4"; //Moto
//             // const address = "F0:67:28:C0:AD:78"; //Oppo Reno3
//             const address = "00:18:E4:40:00:06";

//             let con2  = await RNBluetoothClassic.getConnectedDevice(address);
//             console.log('Check ----- ',con2)
//           } catch (err) {
//             console.log(err)
//           }
//     }

    
//     function checkDevice(){
        
//         let subscription = RNBluetoothClassic.onDeviceConnected((BluetoothDeviceEvent)=>{
//             console.log(BluetoothDeviceEvent.device)
//             setDevice(BluetoothDeviceEvent.device);
//         });
//     }

//     async function accept(){
//         let device = await RNBluetoothClassic.accept({});
//         console.log(device)
//         setDevice(device);

//         // let connection = await device.connect({
//         //     CONNECTOR_TYPE: "rfcomm",
//         //     DELIMITER: "\n",
//         //     DEVICE_CHARSET: Platform.OS === "ios" ? 1536 : "utf-8",
//         //  });
//     }

    

//     async function startDiscovery(){
//         try {
//             let granted = await requestAccessFineLocationPermission();
        
//             if (!granted) {
//                 throw new Error(`Access fine location was not granted`);
//             }
        
//             // this.setState({ discovering: true });
        
//             try {
//                 let unpaired = await RNBluetoothClassic.startDiscovery();
                
//                 console.log(`Found ${unpaired.length} unpaired devices.`);
//                 console.log(unpaired)

//             } finally {
//             // this.setState({ devices, discovering: false });
//             }      
//           } catch (err) {
//             console.log(err.message);
//           }
//     }

//     function pair(){
//       const address = "F0:67:28:C0:AD:78"; //Oppo Reno3
//       RNBluetoothClassic.pairDevice(address);
//       console.log("Done")
//   }

//   async function connect(){
//     try {
//       let connection = await device.isConnected();
//       console.log(connection)
//       if (!connection) {
//         connection = await device.connect();
//         console.log(connection);
//       }
//       console.log('connected already')
//     } catch (error) {
//       // Handle error accordingly
//     }
//   }
  
//   async function write(){
//     await device.write('abcd');
//   }



//   useEffect(()=>{
//     let subscription = RNBluetoothClassic.onDeviceConnected(()=>{
//       console.log(BluetoothDeviceEvent.device);
//     });
//   },[])
    
//     return (
//         <>
//             <Text>ABCD EF GHI JKL</Text>
//             <Button title="Check Paired" onPress={()=>{checkPaired()}}></Button>
//             <Button title="Check Connected Devs" onPress={()=>{checkConnectedDevs()}}></Button>
//             <Button title="Check Connected Dev" onPress={()=>{checkConnectedDev()}}></Button>
//             <Button title="Check Device" onPress={()=>{checkDevice()}}></Button>
//             <Button title="Accept" onPress={()=>{accept()}}></Button>
//             <Button title="Start Discovery" onPress={()=>{startDiscovery()}}></Button>
//             <Button title="Pair Device" onPress={()=>{pair()}}></Button>
//             <Button title="Connect" onPress={()=>{connect()}}></Button>
//             <Button title="Write" onPress={()=>{write()}}></Button>
//         </>
//     );
//     }



    
