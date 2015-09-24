app.config(function ($stateProvider) {
    $stateProvider.state('root.procedures', {
        templateUrl: 'js/procedures/procedures.html',
        controller: 'ProcedureController'
    });
});

app.controller('ProcedureController', ($scope, $state) => {
    $scope.keyboardStep = false;
    $scope.mobileStep = false;

    $scope.goToKeyBoard = function() {
        $scope.keyboardStep = !$scope.keyboardStep;
        $state.go('root.screen', {
            type: 'keyboard'
        });
    };

    $scope.goToMobile = function() {
        $scope.mobileStep = !$scope.mobileStep;
    };

    $scope.goBack = function() {
        $scope.keyboardStep = false;
        $scope.mobileStep = false;
    };
});
