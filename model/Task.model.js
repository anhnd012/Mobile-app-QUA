var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    summary: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    timeStart: {
        type: Date,
        default: Date.now
    },
    due_date: Date,
    reminder: {
        type: Boolean,
        default: false
    },
    timeReminder: Date,
    repeat_type: Number,
    finished: {
        type: Boolean,
        default: false
    },
    item: [
        {
            title: String,
            finished: {
                type: Boolean,
                default: false
            }
        }
    ],
    sound: Number,
    created:{
        type: Date,
        default: Date.now
    }
})

var Task = mongoose.model('task', taskSchema, 'tasks')
module.exports = Task