const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

let messageSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActiveFriend'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: String
});

// Export the model
module.exports = mongoose.model('Message', messageSchema, 'messages');