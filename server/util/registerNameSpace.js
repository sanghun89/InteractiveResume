module.exports = function(nsp, room) {
    let room_client, controller_client;
    nsp.on('connection', function(socket) {
        socket.on('connect-to-room', function() {
            if (room.room_socket) {
                socket.emit('connect-error', 'Room Exists Already. Try Again');
                return;
            }

            room_client = room_client || socket;
            room.room_socket = socket.id;
            room.save().then(function(r) {
                room = r;
                socket.emit('room-connected', r);
            });

            socket.on('disconnect', function () {
                room.remove();
            });
        });

        socket.on('connect-as-client', function() {
            if (room.control_socket) {
                socket.emit('connect-error', 'Room is Occupied. Try Again');
                return;
            }

            controller_client = controller_client || socket;
            room.control_socket = socket.id;
            room.save().then(function(r) {
                room = r;
                socket.emit('room-connected', r);

                if (room.room_socket && room.control_socket) {
                    nsp.emit('start-screen');
                }
            });

            socket.on('disconnect', function () {
                room.control_socket = null;
                room.save();
            });
        });

        socket.on('message-to-room', function(data) {
            data.body = data.body || null;
            if (room_client) {
                room_client.emit(data.message, data.body);
            }
        });

        socket.on('message-to-client', function(data) {
            data.body = data.body || null;
            if (controller_client) {
                console.log('here');
                console.log(data);
                controller_client.emit(data.message, data.body);
            }
        });
    });
};
