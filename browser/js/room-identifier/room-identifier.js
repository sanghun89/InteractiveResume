app.directive('roomIdentifier', (RoomService, $state, $rootScope) => ({
    restrict: 'E',
    templateUrl: 'js/room-identifier/room-identifier.html',
    replace: true,
    link(scope) {
        scope.room = {
            _id : null,
            room_socket: null,
            control_socket: null
        };

        scope.qr_code = null;

        RoomService.getARoom().then((room) => {
            _.assign(scope.room, room);
            return RoomService.connectToRoom(room._id, 'room_socket');
        }).then((room) => {
            _.assign(scope.room, room);
            scope.qr_code = RoomService.makeQRCode(room._id);

            let socket = RoomService.getSocket();

            socket.emit("establish-room");

            if (socket) {
                socket.on('start-screen', () => {
                    if(!$state.includes('root.screen')) {
                        $state.go('root.screen', {
                            type: 'phone'
                        });
                    } else {
                        $rootScope.$broadcast('unpause');
                        socket.emit('message-to-client', {
                            message: 'loaded'
                        });
                    }
                });
            }

        }).catch(console.log.bind(console));
    }
}));
