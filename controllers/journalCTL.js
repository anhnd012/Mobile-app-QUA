const { ObjectId } = require('mongodb');
const Journal = require('../model/journal');
const io = require('../socket');

exports.postAddJournal = (req,res) =>{
    // const title = req.body.title;
    // const thoughts = req.body.thoughts;
    // const imageUrl = req.body.imageUrl;
    // const timeAdded = req.body.timeAdded;
    // const username = req.body.username;
    // const userId = req.body.userId;
    // console.log(req.body);
    const journal = new Journal({
        title : req.body.title,
        thoughts : req.body.thoughts,
        imageUrl : req.body.imageUrl,
        timeAdded : req.body.timeAdded,
        username : req.body.username,
        userId : ObjectId(req.body.userId)
    })
    journal
    .save()
    .then(result =>{
        console.log(result);
        console.log("Save Journal Success");
        res.status(200).send();
    })
    .catch(err =>{
        console.log(err);
    })
    
}

exports.getJournal= (req,res) =>{
    Journal.find({}, (err,journals) =>{
            const JournalList = [];

            journals.forEach((journal) =>{
                JournalList.push(journal) ;
            })
            console.log(JournalList);
            console.log("List successfully");
            // io.getIO().emit('reload',  {JournalList: JournalList});
            res.status(200).send(JSON.stringify(JournalList));
    })
}

exports.getUserIdByTimeStamp = (req,res) =>{
    const timestamp =   req.body.timestamp;
    console.log(req.body);
    Journal.findOne({timeAdded : timestamp}, (err,journal) =>{
            if(journal != null){
                const userId = journal.userId;
                console.log(userId);
                res.status(200).send(JSON.stringify(userId));
            }
            else{
                console.log(err);
                res.status(404).send();
            }
    })
}

exports.deleteJournal = (req,res) =>{
    const timestamp = req.body.timestamp;
    Journal.findOneAndDelete({timeAdded : timestamp}, (err,result) =>{
        if(result != null){
            console.log("Delete successfully");
            res.status(200).send();
        }
        else{
            console.log("Delete Failed");
        }
    })
}