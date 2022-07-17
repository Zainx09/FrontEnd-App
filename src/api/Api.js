import axios from 'axios'
//base url is used to connect axios to express server.
//but if we run our server on our PC then it is very difficult to connect
//so we use ngrok to connect axios and express sever

//ngrok provide a url
export default axios.create({
    
    baseURL:'https://fyp-express-server.herokuapp.com/'
    // baseURL:'http://3c7b-39-50-178-125.ngrok.io'
});

