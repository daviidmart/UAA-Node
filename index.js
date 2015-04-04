// Este archivo, por simplicidad, debe de estar en 
// la misma carpeta donde instalaste socket.io

// Importamos socket.io y asignamos el puerto por donde recibirá la conexión
var mysql = require('mysql');
var io = require("socket.io").listen(1337);

var db = mysql.createConnection({
    host: 'localhost',
    user: 'socketUAA',
    password: 'y7Xfu6_3',
    database: 'uaa_connect'
});

db.connect(function(err){
    if (err) console.log(err)
})

var nicks = [];
var socketid = 0;

// Cuando alguien se conecte
io.sockets.on("connection", function(socket) {

  // Cuando el cliente emita el mensaje nick
    socket.on("nick", function(nick) {
        
        nicks.push(nick); // Guardamos el nick
        db.query('UPDATE users SET socket = ? WHERE user = ?', [socket.id,nick], function(err, result) {});
        io.sockets.emit("nicks", nicks); // Emitimos al cliente todos los nicks
        console.log('Se ha conectado el usuario: '+nick+' |-| '+ socket.id);

        // Cuando el cliente ya haya enviando su nick
        // y emita un mensaje
        socket.on("msg", function(msg) {
            
            var to  = msg.to;
            var type = msg.type;
            if(type == 'message'){
                db.query('SELECT seudo, socket from users WHERE user = ?', [to], function(err, rows, fields) {
                  if (rows.length > 0){
                    var para = rows[0].socket;
                    var seudo = rows[0].seudo;
                    var mensaje = '{ "mensa": "'+msg.mensaje+'", "name": "'+msg.name+'", "from": "'+msg.from+'", "to": "'+to+'", "seudo": "'+seudo+'", "type": "'+type+'" }';
                        
                    io.to(para).emit("msg", nick, mensaje);
                    db.query('INSERT INTO mensajes values (?,?,?,?,?,?)',  ['',nick,to,msg.mensaje,'',1], function(err, result) {if (err) console.log(err)});
                    //console.log(' |-DE-| '+nick+' |-PARA-| '+to+' |-SOCKET-| '+para);
                  }
                });
            }
            
            if(type == 'push'){
                var mensaje = '{ "mensa": "'+msg.mensaje+'", "seudo": "ADMIN", "type": "'+type+'" }';
                io.sockets.emit("msg", nick, mensaje);
            }
            
        });
        
        // Cuando alguien se desconecte
        // eliminamos el nick del arreglo
        // y emitimos de nuevo todos los nicks
        socket.on("disconnect", function() {
            nicks.splice(nicks.indexOf(nick), 1);
            io.sockets.emit("nicks", nicks);
            //console.log('Se ha desconectado el usuario: '+nick+' |-| '+ socket.id);
        });
    });
});