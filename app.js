const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');
const PORT =  process.env.PORT || 5000;
dotenv.config({path: './.env'});
require('./db/conn');
app.use(express.json())
app.use(cors());

// const User = require('./model/userSchema');


// We link the router file
app.use(require('./router/auth'));

 
app.get('/', (req,res)=>{
    res.send('Hello from the server')
})

// if(process.env.NODE_ENV == "production"){
//     app.use(express.static("client/build"));
// }

app.listen(PORT, ()=>{
    console.log(`Server is running on port 5000`);
})
