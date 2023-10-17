const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const journalSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title : { 
        type : String
    },
    thoughts : {
        type : String,
    },
    imageUrl : {
        type : String,
        //required : true,
    },
    timeAdded : {
        type : Number,
        //required : true,
    },
    username :{
        type: String
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    //picture: Buffer,
    created:{
        type : Date, 
        default: Date.now
    },
    like : Number
})
module.exports = mongoose.model('Journal', journalSchema);