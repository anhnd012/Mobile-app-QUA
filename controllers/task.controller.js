var mongoose = require('mongoose');
const Task = require('../model/Task.model');
const moment = require('moment')
//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

//create
module.exports.task_create = function (req, res) {  
    console.log("req.body: ", req.body)
    console.log(" req.params.id: ",  req.params.id)
    const task = new Task(
        {
            _id: new mongoose.Types.ObjectId,
            title: req.body.title,
            summary: req.body.summary,
            user: req.body.userid,
            reminder: req.body.reminder,
            repeat_type: req.body.repeat_type,
            finished: req.body.finished,
            item: req.body.item,
            sound : req.body.sound
        }
    );
    console.log("create task", task);
    if(req.body.yearS != null){
        task.start_date =new Date(req.body.yearS, req.body.monthS, req.body.dayS, req.body.hourS, req.body.minuteS)
    }
    if(req.body.yearD != null){
        task.due_date = new Date(req.body.yearD, req.body.monthD, req.body.dayD, req.body.hourD, req.body.minuteD)
    }
    if(req.body.yearR != null){
        task.reminder = true
        task.timeReminder = new Date(req.body.yearR, req.body.monthR, req.body.dayR, req.body.hourR, req.body.minuteR)
    }
    //console.log('them dl co name="', req.body.name);
    task.save(function (err) {
        if (err){
            console.log("task Created fail");
            res.status(404).send();
            throw err;
        } 
        console.log("task Created successfully");
        res.status(201).send('task Created successfully')
    })
};

//read
exports.get_all_task = function (req, res) {
    console.log( "user : ", req.body.userid)
    Task.find({
        user : req.body.userid
    }, function (err, tasks) {
        if (err) return next(err);
        var showtask = []
        for (let i of tasks){
            console.log(i)
            var x ={
                //_id: i._id,
                title: i.title,
                summary: i.summary,
                //user: req.params.id,
                //reminder: i.reminder,
                //repeat_type: i.repeat_type,
                finished: i.finished,
                //item: i.item,
                //start_date: moment(i.start_date).format('LLL'),
                due_date: i.due_date,
                reminder_date: i.reminder_date
            }
            // console.log("tasks.reminder_date" , i.reminder_date)
            // console.log("x.reminder_date" , x.reminder_date)
            showtask.push(i)
        }
        res.status(200).send(JSON.stringify(showtask));
    })
};
exports.task_details = function (req, res) {
    console.log( "user : ", req.body.userid)
    console.log( "idTask : ", req.body.taskid)
    Task.findOne({
        user : req.body.userid,
        _id : req.body.taskid
    }, function (err, task) {
        if (err){
            res.status(404).send()
            throw (err);
        }
        if(task){
            // var showtask = {
            //     _id: task._id,
            //     title: task.title,
            //     summary: task.summary,
            //     user: req.params.id,
            //     reminder: task.reminder,
            //     repeat_type: task.repeat_type,
            //     finished: task.finished,
            //     item: task.item,
            //     start_date: moment(task.start_date).format('LLL'),
            //     due_date: moment(task.due_date).format('LLL'),
            //     reminder_date: moment(task.reminder_date).format('LLL')
            // }  
            res.status(200).send(JSON.stringify(task));
        }else{
            res.status(404).send()
        }        
    })
};


//update - chưa doi trong database
exports.task_update = function (req, res, next) {  
    Task.findOneAndUpdate({
        user : req.body.userid,
        _id : req.body.taskid
    }, function (err, task) {
        if (err){
            res.status(404).send();
            throw (err);
        }

        var due_date = new Date(req.body.yearD, req.body.monthD - 1, req.body.dayD, req.body.hourD, req.body.minuteD)
        var reminder_date = new Date(req.body.yearR, req.body.monthR - 1, req.body.dayR, req.body.hourR, req.body.minuteR)

 

        task.update({
            title: req.body.title,
            summary: req.body.summary,
            //reminder: req.body.reminder,
            //repeat_type: req.body.repeat_type,
            finished: req.body.finished,
            //item: req.body.item,
            //timeStart : req.body.timeStart,
            sound: req.body.sound,
            due_date : due_date,
            reminder_date : reminder_date 
        })
        res.status(200).send(task)
    })
};
exports.task_finished = function (req, res) {
    console.log( "user : ", req.body.userid)
    console.log( "idTask : ", req.body.taskid)
        
    Task.findOneAndUpdate(
        {
            user : req.body.userid,
            _id : req.body.taskid
        },  
        {
            $set: {
                finished: req.body.finished               
            }
        }, 
        function (err, task) {
            if (err) throw (err);
            console.log(task, " da update thanh cong")
            res.status(200).send('Task udpated.');
    });

}


//delete
exports.task_delete = function (req, res) {
    console.log(req.body)
    Task.findOneAndRemove({
        user : req.body.userid,
        _id : req.body.taskid
    }, function (err) {
        if (err){
            res.status(405).send();
            throw (err);
        }
        res.status(200).send('Deleted successfully!');
    })
};


