const express = require('express');
const socket = require('socket.io');

const PORT = 3000; 
const app = express();

const server = app.listen(PORT, () =>{
    console.log(`Escuchando por el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

//Habilitar el acceso a los archivos estaticos
app.use(express.static('public'));

//Configuracion del socket
const io = socket(server);
const activeUsers = new Set();

io.on('connection', (socket) =>{
    console.log('Conexion del socket establecida');
    
    socket.on('new user', (data) =>{
        socket.userId = data;
        activeUsers.add(data);
        io.emit('new user', [...activeUsers]);
    });

    socket.on('disconnect', () =>{
        activeUsers.delete(socket.userId);
        io.emit('disconnect', socket.userId);
    });

    socket.on('chat message', (data) =>{
        io.emit('chat message', data);
    });

    socket.on('typing', (data) =>{
        socket.broadcast.emit('typing', data)
    });
});