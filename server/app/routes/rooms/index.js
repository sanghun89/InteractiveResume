'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Room = mongoose.model('Room');
var registerNameSpace = require('../../../util/registerNameSpace');

mongoose.Promise = require('bluebird');

module.exports = router;

router.get('/', function (req, res, next) {
    Room.generateRoom().then(function(room) {
        var io = require('../../../io')();

        if (io) {
            var nsp = io.of('/' + room._id);
            registerNameSpace(nsp, room);
        }

        res.json(room);
    })
    .catch(next);
});
