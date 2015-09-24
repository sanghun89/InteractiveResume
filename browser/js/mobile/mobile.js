app.config(function ($stateProvider) {
    $stateProvider.state('root.mobile', {
        templateUrl: 'js/mobile/mobile.html',
        controller: 'MobileController'
    });
});

app.controller('MobileController', ($scope, RoomService) => {
    $scope.connected = false;
    $scope.loading = false;
    $scope.room = null;
    $scope.err = null;
    let socket = null;
    $scope.connectToRoom = function(roomID) {
        RoomService.connectToRoom(roomID, true).then((room) => {
            $scope.room = room;
            $scope.loading = true;

            socket = RoomService.getSocket();
            if (socket) {
                socket.on('loaded', () => {
                    console.log('here');
                    $scope.loading = false;
                    $scope.connected = true;
                    $scope.$apply();
                });
            }
        });
    };
});
