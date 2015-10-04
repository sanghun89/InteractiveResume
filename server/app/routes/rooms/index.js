'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Room = mongoose.model('Room');
var registerNameSpace = require('../../../util/registerNameSpace');

mongoose.Promise = require('bluebird');

module.exports = router;

var io;
router.get('/', function (req, res, next) {
    Room.generateRoom().then(function(room) {
        io = require('../../../io')();
        if (io) {
            var nsp = io.of('/' + room._id);
            registerNameSpace(nsp, Room);
        }
        res.json(room);
    })
    .catch(next);
});

router.get('/:roomID', function(req, res, next) {
    Room.findById(req.params.roomID)
        .then(function(room) {
            if (!room) {
                throw new Error("Room does not exist");
            }

            res.json(room);
        }).catch(next);
});

router.put('/', function(req, res, next) {
    if (!req.body) return next(new Error("Request Parameters Missing"));

    Room.updateRoom(req.body)
        .then(function(room) {
            res.json(room);
        }).catch(next);
});
