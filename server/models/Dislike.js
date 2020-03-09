const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dislikeSchema = mongoose.Schema({
    userId : {
        // User.js의 모든 field를 가져올 수 있다.
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    commentId : {
        type : Schema.Types.ObjectId,
        ref : 'Comment'
    },
    videoId : {
        type : Schema.Types.ObjectId,
        ref : 'Video'
    }     
}, { timestamps : true })

const Dislike = mongoose.model('Dislike', dislikeSchema);

module.exports = { Dislike }