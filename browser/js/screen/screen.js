app.config(function ($stateProvider) {
    $stateProvider.state('root.screen', {
        templateUrl: 'js/screen/screen.html',
        controller: 'ScreenController',
        params: {
            'type' : ''
        }
    });
});

app.controller('ScreenController', ($scope, $rootScope, RoomService, Scene, $stateParams) => {
    $scope.percentage = 0;

    if (THREE.interactiveLoaded) {
        $scope.percentage = 100;
    }

    $scope.type = $stateParams.type;

    $scope[$stateParams.type] = true;

    $scope.$emit('load-scene');

    let socket = RoomService.getSocket();
    $scope.$on('progress', (_, data) => {
        $scope.percentage = data.loaded_perc;

        if (data.loaded_perc >= 100 && socket && $scope.phone) {
            socket.emit('message-to-client', {
                message: 'loaded'
            });
        }

        $scope.$apply();
    });

    if (socket) {
        socket.on('start-scene', () => {
            Scene.unpause();
            $rootScope.$broadcast('unpause');

            $scope.start($scope.type);
            $scope.$apply();
        });

        socket.on('pause-scene', () => {
            Scene.pause();
            $rootScope.$broadcast('pause');
            $scope.$apply();
        });

        socket.on('controller-disconnected', () => {
            Scene.pause();
            $rootScope.$broadcast('pause');
            $scope.$apply();
        });
    }
});
