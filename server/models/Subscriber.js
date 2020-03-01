const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subscriberSchema = mongoose.Schema({
    userTo : {
        // User.js의 모든 field를 가져올 수 있다.
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    userFrom : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }    
}, { timestamps : true })

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }