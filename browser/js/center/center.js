app.directive('threeCenter', () =>({
    restrict: 'E',
    template: ' <div class="center-container"><div class="center" ng-transclude></div></div>',
    transclude: true,
    replace: true
}));
