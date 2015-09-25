module.exports = function(nsp, room) {
    let room_client, controller_client, room_waiting = false;

    nsp.on('connection', function(socket) {
        if (room.room_socket && !room.control_socket && room_waiting) {
            room.control_socket = socket.id;
            room.save().then(function() {
                controller_client = socket;
                controller_client.emit('pause-state');
                room_waiting = false;
            });
        }

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
        });

        socket.on('connect-as-client', function() {
            if (!room) {
                socket.emit('connect-error', 'Room does not exist');
                return;
            }

            if (room.control_socket && room.control_socket !== socket.id) {
                socket.emit('connect-error', 'Room is Occupied. Try Again');
                return;
            }

            if (room.control_socket === socket.id) {
                controller_client.emit('room-connected', room.toObject());

                if (room.room_socket && room.control_socket) {
                    nsp.emit('start-screen');
                }
                
                return;
            }

            room.control_socket = socket.id;
            room.save().then(function() {
                room_waiting = false;
                controller_client = socket;
                controller_client.emit('room-connected', room.toObject());

                if (room.room_socket && room.control_socket) {
                    nsp.emit('start-screen');
                }
            }, function(err) {
                console.log(err);
            });
        });

        socket.on('disconnect', function () {
            if (!room) {
                socket.emit('connect-error', 'Room does not exist');
                return;
            }

            if (room.control_socket === socket.id) {
                room.control_socket = null;
                room.save().then(function(){
                    if (room_client) {
                        if (socket.disconnect)
                            socket.disconnect();

                        if (socket.destroy)
                            socket.destroy();

                        room_client.emit('controller-disconnected');
                        room_waiting = true;
                    }
                });
            } else {
                room.remove().then(function() {
                    room = null;
                    if (controller_client) {
                        controller_client.emit('room-disconnected');
                    }
                });
            }
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
