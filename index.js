const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');
const PORT =  process.env.PORT || 5000;
dotenv.config({path: './.env'});
require('./db/conn');
app.use(express.json())
app.use(cors());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// const User = require('./model/userSchema');


// Importing Posts model 
require('./model/post');


// We link the router file
app.use(require('./router/auth'));
app.use(require('./router/posts'));

 
app.get('/', (req,res)=>{
    res.send('Hello from the server')
})

// if(process.env.NODE_ENV == "production"){
//     app.use(express.static("client/build"));
// }

app.listen(PORT, ()=>{
    console.log(`Server is running on port 5000`);
})
