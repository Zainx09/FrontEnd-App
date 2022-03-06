import axios from 'axios'


//base url is used to connect axios to express server.
//but if we run our server on our PC then it is very difficult to connect
//so we use ngrok to connect axios and express sever

//ngrok provide a url but it will change after every 2 hours
export default axios.create({
    baseURL:'https://8a66-116-90-101-44.ngrok.io'
});