const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postschema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },

    body:{
        type: String,
        required: true,
    },
    postedBy:{
        type: ObjectId,
        ref: "USER"
    }
})

module.exports = mongoose.model("Post", postschema);