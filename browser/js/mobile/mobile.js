app.config(function ($stateProvider) {
    $stateProvider.state('root.mobile', {
        templateUrl: 'js/mobile/mobile.html',
        controller: 'MobileController'
    });
});

app.controller('MobileController', ($scope) => {
    $scope.roomID = null;
    $scope.connectToRoom = function() {

    };
});
