var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var redis = require('redis');
var redisSubscriber = redis.createClient();
var redisPublisher = redis.createClient();
var lastKnownRouteLocation = {};


redisSubscriber.on('subscribe', function (channel, count) {
        console.log('client subscribed to ' + channel + ', ' + count + ' total subscriptions');
});

redisSubscriber.on('message', function (channel, message) {
    console.log('client channel ' + channel + ': ' + message);
    io.emit('locationUpdate', message);
});


var port = process.env.PORT || 3000;

// Start the Server
http.listen(port, function () {
    console.log('Server Started. Listening on *:' + port);
});


// Express Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Render Main HTML file
app.get('/', function (req, res) {
    redisSubscriber.subscribe('locationUpdate');
    res.sendFile('views/index.html', {
        root: __dirname
    });
});

// Render Main HTML file
app.get('/publish', function (req, res) {
    res.sendFile('views/publisher.html', {
        root: __dirname
    });
});

app.get('/clientmap', function (req, res) {
    res.sendFile('views/clientsidemap.html', {
        root: __dirname
    });
});

// API - Join Chat
app.post('/clocation', function (req, res) {
    //client.publish('locationUpdate', JSON.stringify(req.body));
    var x = JSON.stringify(req.body);
    client2.publish('locationUpdate', x );
    console.log(x);
});


// Socket Connection
// UI Stuff
io.on('connection', function (socket) {
    console.log('socket created');

    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId);
        previousId = currentId;
      };

    socket.on('disconnect', function() {
     console.log('Got disconnect!');


   });

   socket.on('lastKnownLocation', function (data) {
            var x = JSON.stringify(data);
           redisPublisher.publish('locationUpdate', x );
           console.log(x);
     });

//    // Fire 'send' event for updating Message list in UI
//    socket.on('message', function (data) {
//        io.emit('send', data);
//    });
//
//    // Fire 'count_chatters' for updating Chatter Count in UI
//    socket.on('update_chatter_count', function (data) {
//        io.emit('count_chatters', data);
//    });

});
