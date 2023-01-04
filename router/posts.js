const express = require('express');
const app = express();
const User = require('../model/userSchema')
const mongoose = require('mongoose');
const Post = require('../model/post')
const router = require('./auth');
const authenticate = require('../middleware/authenticate')

router.get('/allposts',(req,res)=>{
    Post.find().populate("postedBy", "_id name")
    .then(posts =>{
        res.json({posts : posts})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.get('/myposts', authenticate , (req,res)=>{
    Post.find({postedBy: req.rootUser._id})
    .populate("postedBy", "_id name")
    .then(myposts =>{
        res.json({myposts})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/createpost',  (req, res)=>{
    const {title , body} = req.body;
   
    if(!title || !body){
       return res.status(422).json({err: "Please enter all the details"})
    }


    const post =  new Post({ title: title , body:body , postedBy: req.rootUser })

    post.save().then(result =>{
        res.json({post : result})
    })
    .catch(err =>{
        console.log(err)
    })

})


router.put("/uploadProfilePic", authenticate , (req , res)=>{
    User.findByIdAndUpdate(req.user._id , {
        $set : {Photo : req.body.pic}
    } ,
    {
        new: true
    }).exec((err , result)=>{
        if(err){
            return res.status(422).json({error: err})
        }
        else{
            res.json(result)
        }
    })
})

module.exports = router