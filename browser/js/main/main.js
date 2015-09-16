app.config(function ($stateProvider) {
    $stateProvider.state('root', {
        url: '/',
        abstract: true,
        template: '<div id="main" ui-view></div>',
        controller: 'MainController'
    });
});


app.controller('MainController', ($scope) => {
    $scope.test = true;
});
