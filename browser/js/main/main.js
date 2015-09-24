app.config(function ($stateProvider) {
    $stateProvider.state('root', {
        url: '/',
        controller: 'MainController',
        template: '<div id="main" ui-view></div>'
    });
});

app.controller('MainController', ($window, APP_VARS, $state) => {
    if ($window.innerWidth < APP_VARS.MOBILE_WIDTH) {
        $state.go('root.mobile');
    } else {
        $state.go('root.procedures');
    }
});
