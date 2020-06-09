app.factory('RoomService', ($http, $q, $location, $rootScope) => {
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
        checkRoom(roomID) {
            return $http.get('/api/rooms/' + roomID.toUpperCase())
                        .then(response => response.data);
        },
        connectToRoom(roomID, socket_type) {
            if (socket) {
                return $q.when(room);
            }

            socket = io(`${$location.protocol()}://${location.host}/${roomID.toUpperCase()}`, {
                forceNew : true
            });

            let deferred = $q.defer();

            socket = io(`${$location.protocol()}://${location.host}/${roomID.toUpperCase()}`, {
                forceNew : true
            });

            socket.on('connect', () => {
                $http.put('/api/rooms', {
                    socket_id : socket.id,
                    socket_type,
                    roomID: roomID.toUpperCase()
                }).then((response) => {
                    $rootScope.$broadcast('socket-connected');
                    deferred.resolve(response.data);
                }).catch(function(err) {
                    deferred.reject(err);
                });
            });

            return deferred.promise;
        },
        makeQRCode(roomID) {
            let url = `${$location.protocol()}://${location.host}/${roomID}`;

            url = encodeURIComponent(url);

            return `https://api.qrserver.com/v1/create-qr-code/?data=${url}&size=100x100&bgcolor=E0EDE1&color=865371`;
        },
        getSocket() {
            return socket;
        },
        getRoom() {
            return room;
        }
    };
});
