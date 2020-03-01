const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoSchema = mongoose.Schema({
    writer : {
        // User.js의 모든 field를 가져올 수 있다.
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    title : {
        type : String,
        maxlength : 50
    },
    description : {
        type : String    
    },
    privacy : {
        type : Number
    },
    filePath : {
        type : String
    },
    category : {
        type : String
    },
    views : {
        type : Number,
        default : 0
    },
    duration : {
        type : String
    },
    thumbnail : {
        type : String
    }    
}, { timestamps : true })

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }