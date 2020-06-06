import { botName, hostname, port } from './config';
import './db';
const cors = require('cors');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { userRoutes, authRoutes, avatarRoutes } = require('./routes/index');
const {
    customerJoin,
    getCurrentCustomer,
    customerDisconnect,
    getRoomCustomers,
    leaveCustomerFromOtherRooms,
} = require('./utils/customers');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/avatar', avatarRoutes);

// Run when client connects
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ customerName, room }) => {
        leaveCustomerFromOtherRooms(socket, room);

        const customer = customerJoin(socket.id, customerName, room);
        socket.join(customer.room);

        // Welcome current customer
        socket.emit('message', formatMessage(botName, `Welcome to «${room}»`));

        // Broadcast when customer connects. send message to all
        // except the one that originally emitted the event
        socket.broadcast
            .to(customer.room)
            .emit(
                'message',
                formatMessage(botName, `${customerName} has joined the chat`)
            );

        // Send customers and room info
        io.to(customer.room).emit('roomCustomers', {
            room: customer.room,
            customers: getRoomCustomers(customer.room),
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const customer = getCurrentCustomer(socket.id);
        io.to(customer.room).emit(
            'message',
            formatMessage(customer.customerName, msg)
        );
    });

    // Runs when disconnects
    socket.on('disconnect', () => {
        const customer = customerDisconnect(socket.id);
        if (customer) {
            io.to(customer.room).emit(
                'message',
                formatMessage(
                    botName,
                    `${customer.customerName} has left the chat`
                )
            );

            // Send customers and room info
            io.to(customer.room).emit('roomCustomers', {
                room: customer.room,
                customers: getRoomCustomers(customer.room),
            });
        }
    });
});

server.listen(port, hostname, () =>
    console.log(`Server running at http://${hostname}:${port}/`)
);
