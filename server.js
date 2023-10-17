const express = require('express'),
http = require('http'),
app = express(),
server = http.createServer(app),
io = require('socket.io').listen(server);

const User = require('../model/user');
const MessageUser = require('../model/message');


//DB
const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect('mongodb://127.0.0.1:27017/androidproject', {
    useNewUrlParser: true,
    useCreateIndex: true
});

const ActiveFriend = mongoose.model('ActiveFriend', {
    _id : mongoose.Schema.Types.ObjectId,
    roomId: {
        type: String,
        trim: true
    },
    userJoin: [
        {
            userid:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
});

module.exports = mongoose.model('ActiveFriend', ActiveFriend, 'ActiveFriend');



app.use(express.json())
app.get('/messageUser', (req, res) => {
    MessageUser.find({}).then((messages) => {
        res.send(messages);
        
    }).catch((e) => {
        console.log(e);
    });
});


app.get('/', (req, res) => {    
    res.send('Chat Server is running on port 3000')
});


function getUserName(userID){
    User.findOne(
        {
            _id : userID
        },
        function(err, user){
            if (err) {
                console.log(err);
                return "Khong tim thay";
            } else {
                console.log("getUserName(userID), username: " + user.name);
                return user.name;
            }
        }
    );
    return "Khong tim thay";
}


const users = {}
io.on('connection', (socket) => {

    console.log('user connected')

    socket.on('activeList', function (roomid, userNickname) {
        
        console.log(userNickname);
        // users[socket.id] = userNickname
        ActiveFriend.find({
            roomId  : roomid
        }).then((messages) => {
            // res.send(messages);

            for (var i = 0; i < messages.length; i++) {
                var obj = (messages[i]);
                var senderNickname = obj.userName;
                // var messageContent = obj.message;
                
                console.log(senderNickname + " ase ");

                let message = {  "senderNickname": senderNickname }
                // send the message to the client side 
                io.to(`${socket.id}`).emit('listofActive', message);
                // io.emit('message', message);
            }

        }).catch((e) => {
            console.log(e);
        });
    });

    socket.on ('joinRoom', function(roomID, userID) {
        
        

        ActiveFriend.findOneAndUpdate(
            {
                roomId : roomID
            },
            {
                $push: { userJoin : userID } 
            },
            function(err, success){
                if (err) {
                    console.log(err);
                } else {
                    console.log(success);
                }
            }
        );

        const messageName = new MessageUser({
            roomId : roomID,
            userId: userID,
            message: "*$*"
        });
        messageName.save().then(() => {
            console.log(messageName)
        }).catch((error) => {
            console.log('Error!', error)
        }); 


        var name = getUserName()
    
        console.log(userNickname +" : has joined the chat "  );
        let message = { "userName": user.name }
        socket.broadcast.emit('userjoinedthechat', message);

    })
    socket.on('createRoom', function(userID) {

        users[socket.id] = userID

        const active_list = new ActiveFriend({
            roomId : "100",
            userJoin: [
                {
                    userId : userID
                }
            ]
        });
        active_list.save().then(() => {
            console.log(active_list)
        }).catch((error) => {
            console.log('Error!', error)
        });

        const messageName = new MessageUser({
            roomId : "100",
            userId: userID,
            message: "*$*"
        });
        messageName.save().then(() => {
            console.log(messageName)
        }).catch((error) => {
            console.log('Error!', error)
        }); 


        console.log(userNickname +" : has joined the chat "  );
        let message = { "roomId": roomID }
        socket.broadcast.emit('userCreatedRoom', roomId);
    });
    socket.on('previousMessage', function (roomID, userID) {

        MessageUser.find(
            {
                roomId : roomID
            }).then((messages) => {
                for(var i=0; i<messages.length; i++){
                    var obj = (messages[i]);
                    var senderNickname = getUserName(obj.userId);
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

    socket.on('messagedetection', (roomID, userID, messageContent) => {


        const messageName = new MessageUser({
            roomId : roomID,
            userId: userID,
            message: messageContent
        });
        messageName.save().then(() => {
            console.log(messageName)
        }).catch((error) => {
            console.log('Error!', error)
        }); 


        //log the message in console 


        var userName = getUserName(userId);

        console.log(userId +" :" + messageContent)
        //create a message object 
        let  message = {"message": messageContent, "userName" : userName}
            // send the message to the client side  
        io.emit('message', message );
    });


    

    socket.on('disconnect', function (userID) {

        // socket.broadcast.emit('userdisconnect', users[socket.id])
        var userNickname = users[socket.id]


        //Quyen
        ActiveFriend.findOneAndUpdate(
            {
                roomId : roomID
            },
            {
                $pull: { userJoin : userID } 
            },
            function(err, success){
                if (err) {
                    console.log(err);
                } else {
                    console.log(success);
                }
            }
        );

        const messageName = new MessageUser({
            userId: userID,
            message: "$*$"
        });
        messageName.save().then(() => {
            console.log(messageName)
        }).catch((error) => {
            console.log('Error!', error)
        }); 

        delete users[socket.id]
        console.log(userNickname+ '  disconnected ')
        let message = { "senderNickname": userNickname }
        // socket.broadcast.emit('userjoinedthechat',message);
        socket.broadcast.emit('userdisconnect', message);

        // socket.broadcast.emit("userdisconnect"," user has left ") 

    });
});


server.listen(3000,()=>{

    console.log('Message: Node app is running on port 3000');

});