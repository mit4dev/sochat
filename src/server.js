var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8000, '0.0.0.0');

function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

var isCMConnected = false;
var users = [];

function getUserList() {
    return users;
}

io.on('connect', function (socket) {
    socket.broadcast.emit('message', {uname: 'System', type: 'system', message: 'A user connected.'});
    console.log('User connected');

    socket.on('new message', function (data) {
        socket.broadcast.emit('message', {uname: data.uname, type: 'user', message: data.message, color: data.color});
        console.log('uname:' + data.uname + ' message: ' + data.message);
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('message', {uname: 'System', type: 'system', message: 'A user disconnected.'});
    });

    socket.on('cm-connect',function (data) {
       console.log('CM wants to connect to the server!');
       isCMConnected = true;
    });

    socket.on('cm-disconnect', function () {
       console.log('CM wants to disconnect from the server!');
       isCMConnected = false;
    });

    socket.on('user-whisper',function (data) {
       //TODO: send it to the appropriate user
    });

    socket.on("user-whisper-typing",function () {

    });

    socket.on('user-whisper-erasing',function () {

    });
});