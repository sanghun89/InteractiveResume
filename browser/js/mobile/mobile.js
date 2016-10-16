app.config(function ($stateProvider) {
    $stateProvider.state('root.mobile', {
        templateUrl: 'js/mobile/mobile.html',
        controller: 'MobileController',
        params: {
            'connect' : ''
        }
    });
});

app.controller('MobileController', ($scope, RoomService, $stateParams, BallActions) => {
    let socket;
    const updateOrientation = () => {
        $scope.orientation = window.orientation;
        $scope.$apply();
    };

    $scope.reset = function() {
        $scope.connected = false;
        $scope.loading = false;
        $scope.room = null;
        $scope.err = null;

        if (socket) {
            if (socket.disconnect)
                socket.disconnect();

            if (socket.destroy)
                socket.destroy();
        }
        socket = null;

        window.removeEventListener('deviceorientation', updateOrientation);
    };

    $scope.reset();
    $scope.connectToRoom = function(roomID) {
        RoomService.checkRoom(roomID)
        .then(() => {
            return RoomService.connectToRoom(roomID, 'control_socket')
            .then(function(room) {
                socket = RoomService.getSocket();
                socket.emit('establish-control');

                socket.on('loaded', () => {
                    $scope.loading = false;
                    $scope.connected = true;
                    BallActions.initAccelerometer(socket, $scope);
                    $scope.$apply();
                });

                socket.on('pause-state', () => {
                    $scope.action = 'Start';
                    $scope.$apply();
                });

                socket.on('room-disconnected', () => {
                    $scope.reset();
                    $scope.err = "Room is disconnected";
                    $scope.$apply();
                });

                socket.on('connect-error', (msg) => {
                    $scope.reset();
                    $scope.err = msg;
                    $scope.$apply();
                });

                $scope.room = room;
            });
        }).catch(function(error) {
            console.log(error);
            $scope.err = error.data;
        });
    };

    $scope.$on('socket-connected', () => {
        $scope.action = 'Start';
    });

    if ($stateParams.connect) {
        $scope.connectToRoom($stateParams.connect);
    }

    $scope.sceneUnpause = function() {
        if (socket) {
            socket.emit('message-to-room', {
                message: 'start-scene'
            });
        }

        $scope.action = 'Pause';
    };

    $scope.scenePause = function() {
        if (socket) {
            socket.emit('message-to-room', {
                message: 'pause-scene'
            });
        }

        $scope.action = 'Start';
    };

    $scope.action = 'Start';
    $scope.toggleAction = function() {
        if ($scope.action === 'Start') {
            $scope.sceneUnpause();
        } else {
            $scope.scenePause();
        }
    };

    $scope.orientation = window.orientation;

    window.addEventListener('orientationchange', updateOrientation);
});
