const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const path = require('path')

const app = express()

app.set("view engine", "pug");
app.set("views", "views");
// app.locals.basedir = path.join(__dirname, 'views');
app.locals.basedir = __dirname

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

const viewRoutes = require('./routes/viewRoutes')
const usersapiRoute = require('./routes/api/users.js')
const postsapiRoute = require('./routes/api/post')
const commentsapiRoute = require('./routes/api/comment')
const chatsapiroute = require('./routes/api/chat')
const messagesapiroute = require('./routes/api/message')

app.use('/api/user', usersapiRoute);
app.use('/api/post', postsapiRoute);
app.use('/api/comment', commentsapiRoute);
app.use('/api/chat', chatsapiroute);
app.use('/api/message', messagesapiroute);

app.use('/', viewRoutes);

module.exports = app;
