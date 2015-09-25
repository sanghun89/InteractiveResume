module.exports = function(nsp, room) {
    let room_client, controller_client;

    nsp.on('connection', function(socket) {
        socket.on('connect-to-room', function() {
            if (!room) {
                socket.emit('connect-error', 'Room does not exist');
                return;
            }

            if (room.room_socket) {
                socket.emit('connect-error', 'Room Exists Already. Try Again');
                return;
            }

            room_client = socket;
            room.room_socket = socket.id;
            room.save().then(function() {
                socket.emit('room-connected', room.toObject());
            });

            socket.on('disconnect', function () {
                room.remove().then(function() {
                   room = null;
                   if (controller_client) {
                       controller_client.emit('room-disconnected');
                   }
                });
            });
        });

        socket.on('connect-as-client', function() {
            if (!room) {
                socket.emit('connect-error', 'Room does not exist');
                return;
            }

            if (room.control_socket) {
                socket.emit('connect-error', 'Room is Occupied. Try Again');
                return;
            }

            room.control_socket = socket.id;
            room.save().then(function() {
                controller_client = socket;
                controller_client.emit('room-connected', room.toObject());

                if (room.room_socket && room.control_socket) {
                    nsp.emit('start-screen');
                }
            }, function(err) {
                console.log(err);
            });

            socket.on('disconnect', function () {
                if (!room) {
                    socket.emit('connect-error', 'Room does not exist');
                    return;
                }

                room.control_socket = null;
                room.save().then(function(){
                    if (room_client) {
                        socket.emit('room-disconnected');
                        if (socket.disconnect)
                            socket.disconnect();

                        if (socket.destroy)
                            socket.destroy();
                        room_client.emit('controller-disconnected');
                    }
                });
            });
        });

        socket.on('message-to-room', function(data) {
            data.body = data.body || null;

            if (room_client) {
                room_client.emit(data.message, data.body);
            }
        });

        socket.on('message-to-client', function(data) {
            console.log(data);
            data.body = data.body || null;
            if (controller_client) {
                controller_client.emit(data.message, data.body);
            }
        });
    });
};
