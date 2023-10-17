var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String
})

var Project = mongoose.model('project', ProjectSchema, 'projects')
module.exports = Project