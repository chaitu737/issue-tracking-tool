const express = require('express');
var app = express();
const router = express.Router();
const port = 3000;
const mongoose = require('mongoose');
const User = require('./models/user'); 
const Issue = require('./models/issue');
const bodyParser = require('body-parser');
const authentication = require('./routes/authentication')(router);
const config = require('./config/database');
const cors = require('cors');
const issues = require('./routes/issue')(router);
const Notify = require('./models/notify');
const notify = require('./routes/notify')(router);
 
mongoose.connect(config.uri,(err)=>{
    if(err){
        console.log('Could not connect to database: ', err);
    }
    console.log('Connected to '+ config.db);
});


app.get('/',(req,res)=>{
    res.send('listening')
});

const socketlib = require('./libs/sockelib');
const tokenlib = require('./libs/tokenlib');


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/authentication', authentication);
app.use('/issues', issues);
app.use('/uploads',express.static('uploads'))
app.use('/notification', notify);
const server = app.listen(port,()=>{
    console.log('listening')
});

const socketserver = socketlib.setServer(server);