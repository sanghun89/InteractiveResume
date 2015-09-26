app.config(function ($stateProvider) {
    $stateProvider.state('root.mobile', {
        templateUrl: 'js/mobile/mobile.html',
        controller: 'MobileController',
        params: {
            'connect' : ''
        }
    });
});

app.controller('MobileController', ($scope, $timeout, RoomService, $stateParams, BallActions) => {
    let socket;
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

        window.removeEventListener('deviceorientation');
    };

    $scope.reset();

    $scope.connectToRoom = function(roomID) {
        RoomService.connectToRoom(roomID, true).then((room) => {
            $scope.room = room;
            $scope.loading = true;

            let promise = $timeout(() => {
                if ($scope.loading) {
                    $scope.reset();
                    $scope.err = 'Connection Timed Out. Try again or refresh the desktop page';
                }
            }, 4000);

            socket = RoomService.getSocket();


            BallActions.initAccelerometer(socket, $scope);

            if (socket) {
                socket.on('loaded', () => {
                    console.log('herer');
                    $scope.loading = false;
                    $scope.connected = true;
                    $timeout.cancel(promise);
                    $scope.$apply();
                });

                socket.on('room-disconnected', () => {
                    $scope.reset();
                    $scope.$apply();
                });

                socket.on('connect-error', (msg) => {
                    $scope.reset();
                    $timeout.cancel(promise);
                    $scope.err = msg;
                    $scope.$apply();
                });

                socket.on('pause-state', () => {
                    $scope.action = 'Start';
                    $scope.$apply();
                });
            }
        }).catch((err)=>{
            console.log(err);
        });
    };

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
    window.addEventListener('orientationchange', () => {
        $scope.orientation = window.orientation;
        $scope.$apply();
    });
});
