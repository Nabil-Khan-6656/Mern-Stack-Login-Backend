const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const User = require('../model/userSchema');
const bcrypt = require('bcryptjs');
require('../db/conn');
const cors = require('cors');
router.use(cors())

const cookieParser = require('cookie-parser');

router.use(cookieParser())


// Register the user route
router.post('/register', async(req,res)=>{
    const { name , email , password , cpassword} = req.body;

    //    Check if user has filled all the details 
    if(!name ||  !email ||  !password || !cpassword){
        return res.status(422).json({error : "Please Fill the form porperly"})
    }

    try {
         // Check if user already exist
        const userExist = await  User.findOne({email : email})
        if(userExist){
            return res.status(422).json({error : "Email already exist"})
        }

        // Create a new User in our database
        const user = new User({name , email ,  password , cpassword})

        // save the user in our database
         await user.save();
         res.status(201).json({message : "user registered "})

    } catch (err) {
        console.log(err)
    } 
})


// Login User Route 

router.post('/signin',async (req,res)=>{
    try {
        const { email , password} = req.body ;

        // Check if any field is empty 
        if( !email || !password){
            return res.status(422).json({error : "Please Fill the form porperly"})
        }

        const userLogin = await User.findOne({email: email});

        if(userLogin){
            const isMatch = await bcrypt.compare(password , userLogin.password);
            const token = await userLogin.generateAuthToken();
            res.cookie("jwtoken", token , {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true 
            })

            console.log(token);
            
            if(!isMatch){
                res.status(400).json({err: "Invalid Credentials !"})
            }
            else{
                res.json({message: "Sign in Successful !"})
            }
        }
        else{
            res.status(400).json({err: "Invalid Credentials !"})
        }

       

    } catch (error) {
        console.log(error);
    }
})



// About us Page
   router.get('/about', authenticate,  (req, res)=>{
     res.send(req.rootUser);
   })
   router.get('/roadmaps', authenticate ,  (req, res)=>{
     res.send(req.rootUser);
   })
   router.post('/contact', authenticate, async (req, res)=>{
     try {
     const {name , email , message} =    req.body;

     if(!name  ||!email || !message){
        console.log("Error in Contact form");
        return res.json({error:"Please fill the contact form"})
     }

     const userContact = await User.findOne({_id:req.userID});

     if(userContact){
        const userMessage = await userContact.addMessage(name , email , message);    
        
        await userContact.save();

        res.status(201).json({message: "Message sent successfully"})

    }
     } catch (err) {
        console.log(err);
     }
   })

   router.get('/getdata', authenticate, (req,res)=>{
    res.send(req.rootUser);
   })


   router.get('/logout',   (req, res)=>{
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send('user logout');
  })
module.exports = router ;
