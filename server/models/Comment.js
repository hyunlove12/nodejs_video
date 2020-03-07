const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = mongoose.Schema({
    writer : {
        type : Schema.ObjectId,
        ref : 'User'
    },
    postId : {
        type : Schema.ObjectId,
        ref : 'Video'
    },
    responseTo : {
        type : Schema.ObjectId,
        ref : 'User'
    },
    content : {
        type : String
    }
}, { timestamps : true })

const Comment = mongoose.model('Commnet', commentSchema);

module.exports = { Comment }