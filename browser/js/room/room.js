app.factory('RoomService', ($http, $q, $location, $timeout) => {
    let socket = null,
        room = null;

    return {
        getARoom() {
            if (room) {
                return $q.when(room);
            }

            return $http.get('/api/rooms/')
                .then((response) => response.data)
                .then((r) => {
                    room = r;
                    return r;
                });
        },
        connectToRoom(roomID, client) {
            if (socket) {
                return $q.when(room);
            }

            let deferred = $q.defer();

            socket = io(`${$location.protocol()}://${location.host}/${roomID.toUpperCase()}`, {
                forceNew : true
            });

            if (client) {
                socket.emit('connect-as-client');
            } else {
                socket.emit('connect-to-room');
            }

            socket.on('room-connected', (r) => {
                room = r;
                deferred.resolve(r);
            });

            return deferred.promise;
        },
        makeQRCode(roomID) {
            let url = `${$location.protocol()}://${location.host}/${roomID}`;

            url = encodeURIComponent(url);

            return `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=100x100&bgcolor=E0EDE1&color=865371`;
        },
        getSocket() {
            return socket;
        },
        getRoom() {
            return room;
        }
    };
});
