app.directive('roomIdentifier', (RoomService, $state) => ({
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
            return RoomService.connectToRoom(room._id);
        }).then((room) => {
            _.assign(scope.room, room);
            scope.qr_code = RoomService.makeQRCode(room._id);

            let socket = RoomService.getSocket();

            if (socket) {
                socket.on('start-screen', () => {
                    $state.go('root.screen', {
                        type: 'phone'
                    });
                });
            }

        }).catch(console.log.bind(console));
    }
}));
