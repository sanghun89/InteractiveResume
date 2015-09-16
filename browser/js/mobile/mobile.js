app.config(function ($stateProvider) {
    $stateProvider.state('root.mobile', {
        url: 'mobile',
        templateUrl: 'js/mobile/mobile.html',
        controller: 'MainController'
    });
});
