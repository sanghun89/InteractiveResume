app.config(function ($stateProvider) {
    $stateProvider.state('root.screen', {
        url: 'screen',
        templateUrl: 'js/screen/screen.html',
        controller: 'MainController'
    });
});
