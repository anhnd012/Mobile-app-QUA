const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

let UserSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true, max: 100},
    email: { 
        type: String,
        required: true
    },
    password: {type: String, required: true},
    created:{
        type : Date,
        default: Date.now
    },
    //profile:
    job: String,
    home: String,
    gender: Boolean,
    birthday: {
        type : Date,
        default: Date.now
    },
    maxim: String,
    profilePicture: {
        data: Buffer,
        contentType: String
    }
});

// Export the model
module.exports = mongoose.model('User', UserSchema, 'users');