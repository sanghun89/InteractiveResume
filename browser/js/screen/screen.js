app.config(function ($stateProvider) {
    $stateProvider.state('root.screen', {
        templateUrl: 'js/screen/screen.html',
        controller: 'ScreenController',
        params: {
            'type' : ''
        }
    });
});

app.controller('ScreenController', ($scope, RoomService, $stateParams) => {
    $scope.percentage = 0;

    if (THREE.interactiveLoaded) {
        $scope.percentage = 100;
    }

    $scope[$stateParams.type] = true;

    $scope.$emit('load-scene');

    $scope.$on('progress', (_, data) => {
        $scope.percentage = data.loaded_perc;
        let socket = RoomService.getSocket();

        if (data.loaded_perc >= 100 && socket && $scope.phone) {
            socket.emit('message-to-client', {
                message: 'loaded'
            });
        }

        $scope.$apply();
    });
});
