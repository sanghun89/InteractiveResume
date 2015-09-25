app.config(function ($stateProvider) {
    $stateProvider.state('root', {
        url: '/',
        controller: 'MainController',
        templateUrl: 'js/main/main.html'
    });

    $stateProvider.state('rootMobile', {
        url: '/:connect',
        controller: 'MainController',
        templateUrl: 'js/main/main.html'
    });
});

app.controller('MainController', ($window, APP_VARS, $state, $scope, BallActions, $stateParams, Scene) => {
    $scope.displayCanvas = false;
    $scope.canvasExist = false;
    $scope.goBack = function() {
        $state.go('root.procedures');
    };

    let initialized = false;
    $scope.start = function(type) {
        $scope.displayCanvas = true;

        if (!initialized) {
            if (type === 'phone') {
                BallActions.initPhoneActions();
            } else {
                BallActions.initKeyBoardActions();
                Scene.unpause()
            }

            initialized = true;
        }
    };

    if ($window.innerWidth < APP_VARS.MOBILE_WIDTH) {
        $state.go('root.mobile', $stateParams);
    } else {
        $state.go('root.procedures');
        $scope.canvasExist = true;
    }
});
