app.config(function ($stateProvider) {
    $stateProvider.state('root.mobile', {
        templateUrl: 'js/mobile/mobile.html',
        controller: 'MobileController',
        params: {
            'connect' : ''
        }
    });
});

app.controller('MobileController', ($scope, $timeout, $location, RoomService, APP_VARS, WorldConstants, $stateParams) => {
    $scope.connected = false;
    $scope.loading = false;
    $scope.room = null;
    $scope.err = null;
    let socket = null;

    $scope.connectToRoom = function(roomID) {
        RoomService.connectToRoom(roomID, true).then((room) => {
            $scope.room = room;
            $scope.loading = true;

            let promise = $timeout(() => {
                if ($scope.loading) {
                    $scope.connected = false;
                    $scope.loading = false;
                    $scope.room = null;

                    if (socket.disconnect)
                        socket.disconnect();

                    if (socket.destroy)
                        socket.destroy();
                    socket = null;
                    $scope.err = 'Connection Timed Out. Try again or refresh the desktop page';
                }
            }, 4000);

            socket = RoomService.getSocket();
            if (socket) {
                socket.on('loaded', () => {
                    $scope.loading = false;
                    $scope.connected = true;
                    $timeout.cancel(promise);
                    $scope.$apply();
                });

                socket.on('room-disconnected', () => {
                    $scope.connected = false;
                    $scope.loading = false;
                    $scope.room = null;
                    if (socket.disconnect)
                        socket.disconnect();

                    if (socket.destroy)
                        socket.destroy();
                    socket = null;
                    $scope.$apply();
                });

                socket.on('connect-error', (msg) => {
                    $scope.connected = false;
                    $scope.loading = false;
                    $scope.room = null;
                    if (socket.disconnect)
                        socket.disconnect();

                    if (socket.destroy)
                        socket.destroy();
                    socket = null;
                    $timeout.cancel(promise);
                    $scope.err = msg;
                    $scope.$apply();
                });
            }
        });
    };

    if ($stateParams.connect) {
        $scope.connectToRoom($stateParams.connect);
    }

    let oldBeta, oldGamma,
        vector = {
        x:0,
        y:WorldConstants.GRAVITY_Y,
        z:0
    };

    let newBeta, newGamma, changed = false;
    oldBeta = oldGamma = newBeta = newGamma = 0;
    function orientHandler(event) {
        if ($scope.action === 'Pause') {
            newBeta = Math.round(event.beta);
            newGamma = Math.round(event.gamma);

            changed = !_.inRange(oldBeta, newBeta - APP_VARS.ORIENTATION_OFFSET, newBeta + APP_VARS.ORIENTATION_OFFSET) ||
                !_.inRange(oldGamma, newGamma - APP_VARS.ORIENTATION_OFFSET, newGamma + APP_VARS.ORIENTATION_OFFSET);

            if (changed) {
                vector.x = Math.round(newGamma/90 * WorldConstants.KEY_SPEED);
                vector.z = Math.round(newBeta/90 * WorldConstants.KEY_SPEED);
                oldGamma = newGamma;
                oldBeta = newBeta;

                if (socket) {
                    socket.emit('message-to-room', {
                        message: 'orient-change',
                        body: {
                            vector
                        }
                    });
                }
            }
        }
    }

    if (window.DeviceOrientationEvent) {
        // Listen for the event and handle DeviceOrientationEvent object
        window.addEventListener('deviceorientation', orientHandler, false);
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

    window.onblur = function() {
        $scope.scenePause();
        $scope.$apply();
    }
});
