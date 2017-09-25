var rdp = require('node-rdpjs');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(){ 
var client = rdp.createClient({
        domain : 'f5lab',
        userName : 'administrator',
        password : 'pass@word1',
        enablePerf : true,
        autoLogin : true,
        decompress : false,
        screen : { width : 1024, height : 768 },
        locale : 'en',
        logLevel : 'INFO'
}).on('connect', function () {
}).on('close', function() {
}).on('bitmap', function(bitmap) {
}).on('error', function(err) {
}).connect('154.154.154.140', 3389); 
});
server.listen(3000);
