var _ = require('lodash');

module.exports = function(nsp, Room) {
    let room_client, controller_client;

    nsp.on('connection', function(socket) {

        socket.on('establish-room', function() {
            room_client = socket;
        });

        socket.on('establish-control', function() {
            controller_client = socket;

            if (room_client && controller_client) {
                nsp.emit('start-screen');
            }
        });

        socket.on('disconnect', function () {
            Room.findById(nsp.name.slice(1))
            .then(function(room) {
                var affected_room = _.findKey(room.toObject(), function(row) {
                    return row === socket.id;
                });

                if (affected_room) {
                    room[affected_room] = null;
                    return room.save().then(function() {
                        if (affected_room === "room_socket") {
                            room_client = null;

                            if (controller_client)
                                controller_client.emit('room-disconnected', room.toObject());
                        } else {
                            controller_client = null;

                            if (room_client)
                                room_client.emit('controller-disconnected', room.toObject());
                        }
                    });
                }

                nsp.emit('socket-alone');
            })
            .catch(console.log.bind(console));
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
                controller_client.emit(data.message, data.body);
            }
        });
    });
};
