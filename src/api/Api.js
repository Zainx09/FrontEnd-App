import axios from 'axios'
//base url is used to connect axios to express server.
//but if we run our server on our PC then it is very difficult to connect
//so we use ngrok to connect axios and express sever

//ngrok provide a url
export default axios.create({
    
    baseURL:'https://fyp-express-server.herokuapp.com/'
    // baseURL:'https://81c8-39-50-133-199.ngrok.io'
});

