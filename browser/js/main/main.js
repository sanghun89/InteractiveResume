app.config(function ($stateProvider) {
    $stateProvider.state('root', {
        url: '/',
        controller: 'MainController',
        template: '<div class="screen_canvas" three-init></div><div id="main" ui-view ng-if="!displayCanvas"></div>'
    });
});

app.controller('MainController', ($window, APP_VARS, $state, $scope) => {
    $scope.displayCanvas = false;
    $scope.goBack = function() {
        $state.go('root.procedures');
    };

    $scope.start = function() {
        $scope.displayCanvas = true;
    };

    if ($window.innerWidth < APP_VARS.MOBILE_WIDTH) {
        $state.go('root.mobile');
    } else {
        $state.go('root.procedures');
    }
});
