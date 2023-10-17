const express = require('express');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

const http = require('http')
const server = http.createServer(app)
const socketIo = require('socket.io')
const io = socketIo(server);
const fs = require('fs');
require('dotenv/config');

const userRoute = require('./routes/userRoute');
const journalRoute = require('./routes/journalRoute')
const authRoute = require('./routes/auth.route');
const taskRoute = require('./routes/task.route');

const Image = require('./model/image.js');
const Journal = require('./model/journal.js');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(journalRoute);
app.use('/users', userRoute);
app.use('/', authRoute);
app.use('/task', taskRoute);

app.set("view engine", "ejs");

mongoose.connect(   
    'mongodb+srv://ducanh:Nguyenducanh123@cluster0.u66oa3s.mongodb.net/'
)
.then(result =>{
    console.log("Successfully connected to the database");   
})
.catch(err =>{
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
})


// mongoose.connect('mongodb://localhost:27017/androidproject', { useNewUrlParser: true , useUnifiedTopology: true, rejectUnauthorized: false});
// mongoose.set('useFindAndModify', false);

//const io = require('socket.io')(server)

//const User = require('./model/user');
//const MessageUser = require('../model/message');


//DB

const validator = require('validator')

const ActiveFriend = mongoose.model('ActiveFriend', {
    uniqueId: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        trim: true
    }
});

const MessageUser = mongoose.model('MessageUser', {
    userId: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    }

});


app.use(express.json())
app.get('/messageUser', (req, res) => {
    MessageUser.find({}).then((messages) => {
        res.send(messages);
        
    }).catch((e) => {
        console.log(e);
    });
});


// app.get('/', (req, res) => {    
//     res.send('Chat Server is running on port 3000')
// });

const users = {}
let socket_id;
let user_socket_id;
var arrayImage = new Array();

// app.post('/images',(req, res) => {  

// });


io.on('connection', (socket) => {

    socket.on("connect_error", (err) => {
        console.log("connect_error due to ${err.message}");
    });

    console.log('user connected')
    //___Image___//
    socket.on('CLIENT_SEND_IMAGE', function (data) {
        console.log("SERVER SAVED A NEW IMAGE");
        console.log("CLIENT_SEND_IMAGE: " + data)
        var filename = getFilenameImage(socket.id);
        arrayImage.push(filename);

        var buffer = Buffer.from(data);
        var newimage = new Image ({
            name: filename,
            img : Buffer.from(data)
        });
        newimage.save().then(() => {
            console.log("newimage" + newimage)
        }).catch((error) => {
            console.log('Error!', error)
        });   
    });

    socket.on('CLIENT_SEND_REQUEST', function(data){
        var filename = "dPRqos-9Wj4v3-AAAJ1626750490208.png";

        Image.findOne({
            name: filename
        }).then((image) => {
            // res.send(messages);

            // var name = image.name;
            // var img = image.img;

            // let data = { "name": name, "img": img }
            console.log("image: " + image);
            // send the message to the client side 
            io.to(`${socket.id}`).emit('SERVER_SEND_IMAGE', image);
            // io.emit('message', message);

        }).catch((e) => {
            console.log(e);
        });
    });


    // _____.CHAT.____//
    socket.on('activeList', function (userNickname) {
        
        //console.log("userNickname" + userNickname);
        // users[socket.id] = userNickname
        ActiveFriend.find({}).then((messages) => {
            // res.send(messages);

            for (var i = 0; i < messages.length; i++) {
                var obj = (messages[i]);
                var senderNickname = obj.userName;
                // var messageContent = obj.message;
                
                console.log(senderNickname + " ase ");

                let message = {  "senderNickname": senderNickname }

                // send the message to the client side (private message)
                //io.to('${socket.id}').emit('listofActive', message);
                socket.emit('listofActive', message);
                // io.emit('message', message);
            }

        }).catch((e) => {
            console.log("e: " + e);
        });
    });

    socket.on('join', function(userID, userNickname) {

        socket_id = socket.id
        user_socket_id = userNickname
        users[socket.id] = userNickname

        console.log("users[socket.id] = " + user_socket_id + " socket_id: " + socket_id );

        const active_list = new ActiveFriend({
            uniqueId: socket.id,
            userName: userNickname
        });
        active_list.save().then(() => {
            console.log("active_list" + active_list)
        }).catch((error) => {
            console.log('Error!', error)
        });

        const messageName = new MessageUser({
            userId: userID,
            userName: userNickname,
            message: "*$*"
        });
        messageName.save().then(() => {
            console.log(messageName)
        }).catch((error) => {
            console.log('Error! join 205', error)
        }); 
        console.log(userNickname +" : has joined the chat "  );
        let message = { "senderNickname": userNickname }
        // socket.broadcast.emit('userjoinedthechat',message);
        socket.broadcast.emit('userjoinedthechat',message);
    });
    socket.on('previousMessage', function (userNickname) {

        MessageUser.find({}).then((messages) => {
            // res.send(messages);
            
            for(var i=0;i<messages.length;i++){
                var obj = (messages[i]);
                var senderId = obj.userId;
                var senderNickname = obj.userName;
                var messageContent = obj.message;

                let message = { "message": messageContent, "senderNickname": senderNickname }
                // send the message to the client side 
                io.to(`${socket.id}`).emit('message',message);
                // io.emit('message', message);
            }
        }).catch((e) => {
            console.log(e);
        });

    });

    socket.on('messagedetection', (userID, senderNickname,messageContent) => {


        const messageName = new MessageUser({
            userId: userID,
            userName: senderNickname,
            message: messageContent
        });
        messageName.save().then(() => {
            console.log(messageName)
        }).catch((error) => {
            console.log('Error! messagedection 246', error)
        }); 


        //log the message in console 

        console.log(senderNickname+" :" +messageContent)
        //create a message object 
        let  message = {"message":messageContent, "senderNickname":senderNickname}
            // send the message to the client side  
        io.emit('message', message );
    
    });   

    socket.on('customdisconnect', function (userID, senderNickname) {

        console.log("user disconnected")
        //socket.broadcast.emit('userdisconnect', users[socket.id])
        var userNickname = senderNickname
        console.log("socket_id: " + socket_id + " users[socket.id] " +  user_socket_id);
        ActiveFriend.findOneAndDelete(
        {
            uniqueId : socket_id
        }, function(err) {
            if(err)
                console.log(err)
        });

        const messageName = new MessageUser({
            userId: userID,
            userName: senderNickname,
            message: "$*$"
        });
        messageName.save().then(() => {
            console.log(messageName)
        }).catch((error) => {
            console.log('Error! customedisconnect 282', error)
        }); 

        delete users[socket.id]
        console.log(userNickname+ '  disconnected ')
        let message = { "senderNickname": userNickname }
        // socket.broadcast.emit('userjoinedthechat',message);
        socket.broadcast.emit('userdisconnect', message);

        // socket.broadcast.emit("userdisconnect"," user has left ") 
    });

    // _____.SOCIAL MEDIA.____//

    socket.on('previousJournal', function () {

        Journal.find({}).then((journal) => {            
            for(var i=0;i<journal.length;i++){
                var obj = (journal[i]);
                var journalId = obj._id;
                var title = obj.title;
                var thoughts = obj.thoughts;
                var imageUrl = obj.imageUrl;
                var timeAdded = obj.timeAdded;
                var username = obj.username;
                var userId = obj.userId;
                var like = obj.like;

                let message =  {"title" : title, "thoughts" : thoughts,"imageUrl" : imageUrl,
                                "timeAdded" : timeAdded,"username" : username,"userId" : userId,
                                "like" : like}
                // send the message to the client side 
                io.to(`${socket.id}`).emit('message',message);
                // io.emit('message', message);
            }
        }).catch((e) => {
            console.log(e);
        });

    });
    socket.on('journaldetection', (title, thoughts, imageUrl, timeAdded, username, userId ) => {


        const journal = new Journal({
            _id : mongoose.Schema.Types.ObjectId,
            title : title,
            thoughts : thoughts,
            imageUrl : imageUrl,
            timeAdded : timeAdded,
            username : username,
            userId : userId,
            like : 0
        })
        journal.save().then(result =>{
            console.log("Save Journal Success");
            console.log(journal);
        }).catch(err =>{
            console.log('Error!', err)
        })

        //create a journal object 
        let newjournal = {"_id": journal._id, "title" : title, "thoughts" : thoughts,"imageUrl" : imageUrl,"timeAdded" : timeAdded,"username" : username,"userId" : userId}

        // send the message to the client side  
        io.emit('newjournal', newjournal);

    });  
    socket.on('likejournaldetection', (journalId) => {

        Journal.findByIdAndUpdate(
        {
            _id : journalId
        },  
        {
            $inc : {'like' : 1}
        }, 
        function (err) {
            console.log('Error!', err)
        });


        Journal.find({_id : journalId}).then((journal) => {
            // res.send(messages);
            
            for(var i=0;i<journal.length;i++){
                var obj = (journal[i]);
                var like = obj.like;

                //create a journal object 
                let likejournal = {"journalId": journalId, "like" : like}

                // send the message to the client side  
                io.emit('likejournal', likejournal);
            }
        }).catch((e) => {
            console.log(e);
        });
        
    });  
});




// app.listen(3000,()=>{

//     console.log('Message: App is running on port 3000');

// });



server.listen(3000,()=>{

    console.log('Message: SERVER is running on port 3000');

});


function getFilenameImage(id){
    //return "images/" + id.substring(2) + getMilis() + ".png";
    return id.substring(2) + getMilis() + ".png";
}

function getFilenameSound(id){
    return "sounds/" + id.substring(2) + getMilis() + ".3gpp";
}

function getMilis(){
    var date = new Date();
    var milis = date.getTime();
    return milis;
}

function getRandomFile(array){
    return array[Math.floor(Math.random()*array.length)];
}
