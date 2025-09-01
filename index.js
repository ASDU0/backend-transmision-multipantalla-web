// index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite que tu frontend se conecte

const server = http.createServer(app);

// Aquí permites que la URL de tu frontend se conecte.
// Durante el desarrollo será 'http://localhost:3000'
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Ruta de prueba para saber si el servidor está vivo
app.get('/', (req, res) => {
  res.send('El servidor de señalización está funcionando!');
});

// Lógica principal de Socket.IO
io.on('connection', (socket) => {
  console.log(`Un usuario se conectó: ${socket.id}`);

  // 1. Cuando un usuario se une a una categoría
  socket.on('join-category', (categoryId) => {
    socket.join(categoryId);
    console.log(`Usuario ${socket.id} se unió a la categoría ${categoryId}`);
  });

  // Permite salir de una categoría explícitamente
  socket.on('leave-category', (categoryId) => {
    try {
      socket.leave(categoryId);
      console.log(`Usuario ${socket.id} salió de la categoría ${categoryId}`);
    } catch (e) {
      console.warn('leave-category error', e);
    }
  });

  // 2. Cuando un transmisor envía su señal para iniciar la conexión
  // payload: { category, targetId?, callerID, signal }
  socket.on('sending-signal', (payload = {}) => {
    const { category, targetId, callerID, signal } = payload;
    if (!signal || !callerID) return;
    if (targetId) {
      // enviar dirigido a un socket específico (cuando ya conocen su id)
      io.to(targetId).emit('user-joined', { signal, callerID });
    } else if (category) {
      // broadcast a la sala (excepto al emisor)
      socket.to(category).emit('user-joined', { signal, callerID });
    }
  });

  // 3. Cuando un espectador devuelve la señal para completar la conexión
  // payload: { callerID, signal }
  socket.on('returning-signal', (payload = {}) => {
    const { callerID, signal } = payload;
    if (!callerID || !signal) return;
    io.to(callerID).emit('receiving-returned-signal', { signal, id: socket.id });
  });

  // 3.5 Un espectador avisa que está listo en la categoría
  // payload: { category }
  socket.on('viewer-ready', (payload = {}) => {
    const { category } = payload;
    if (!category) return;
    // Notificar a los demás en la sala (p.ej. broadcasters)
    socket.to(category).emit('viewer-ready', { viewerId: socket.id });
  });

  // 3.6 Un broadcaster anuncia que está listo para enviar ofertas a los viewers actuales
  // payload: { category }
  socket.on('broadcaster-ready', (payload = {}) => {
    const { category } = payload;
    if (!category) return;
    socket.to(category).emit('broadcaster-ready', { broadcasterId: socket.id });
  });

  // 4. Intercambio de candidatos ICE opcional (para compatibilidad)
  // payload: { targetId, candidate }
  socket.on('ice-candidate', (payload = {}) => {
    const { targetId, candidate } = payload;
    if (!targetId || !candidate) return;
    io.to(targetId).emit('ice-candidate', { from: socket.id, candidate });
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
    // Opcional: emitir un evento para que los demás sepan que alguien se fue
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));