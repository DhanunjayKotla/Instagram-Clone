const mongoose = require('mongoose')
const app = require('./app')
require("dotenv").config();

mongoose
    .connect(process.env.DATABASE_ATLAS, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Successfully connected to the database!'))
    .catch(err => console.log('Failed to connect to the database! ' + err.message));

const server = app.listen(3000, () => {
    console.log('server is listening on port 3000');
})

const io = require('socket.io')(server, { pingTimeout: 60000 });

io.on('connection', socket => {
    socket.on('setup', rgv => {
        socket.join(rgv._id)
        socket.emit('connected')
    })

    socket.on('msg', msg => {
        msg.chat.users.forEach(element => {
            if (element != msg.sender._id)
                socket.in(element).emit('msg', msg)
        });
    })

    socket.on('follow', (username, userid) => {
        socket.in(userid).emit('follow', username);
    })

    socket.on('like', (user, userid) => {
        if (user._id !== userid) {
            socket.in(userid).emit('like', user.username);
        }
    })

})
