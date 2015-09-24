app.directive('step', () =>({
    restrict: 'E',
    template: '<div class="step" ng-transclude></div>',
    transclude: true,
    replace: true
}));
