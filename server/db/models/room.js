'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
mongoose.Promise = require('bluebird');

var schema = new mongoose.Schema({
    _id : String,
    room_socket: String,
    control_socket: String
});

var room_config = {
    roomKeySet: 4,
    asciiStartPoint: 65,
    asciiRange: 26
};

function makeRoomId(rooms) {
    var text = "", code;

    for (var i = 0; i < room_config.roomKeySet; i++) {
        code = Math.floor(Math.random() * room_config.asciiRange) + room_config.asciiStartPoint;
        text += String.fromCharCode(code);
    }

    if (!rooms) {
        return text;
    }

    var unique = false;

    unique = !_.find(rooms, function(room) {
        return room._id === text;
    });

    if (unique) {
        return text;
    }

    return makeRoomId(rooms);
}

schema.statics.generateRoom = function() {
    var Room = this;

    return Room.find({}).then(function(rooms) {
        var roomID = '';
        if (rooms.length === 0) {
            roomID = makeRoomId();

            return Room.create({
                _id : roomID
            });
        }

        roomID = makeRoomId(rooms);

        return Room.create({
            _id : roomID
        });
    });
};

schema.statics.updateRoom = function(info) {
    var Room = this;
    return Room.findById(info.roomID)
        .then(function(room) {
            if (!room) {
                throw new Error("Room does not exist");
            } else {
                if (info.socket_type === "control_socket") {
                    if (room.control_socket) {
                        throw new Error("Room is already occupied");
                    }
                }
            }

            room[info.socket_type] = info.socket_id;

            return room.save();
        });
};



mongoose.model('Room', schema);
