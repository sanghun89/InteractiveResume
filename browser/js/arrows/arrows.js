app.directive('arrows', () =>({
    restrict: 'E',
    templateUrl: 'js/arrows/arrows.html',
    transclude: true,
    replace: true,
    link(scope) {
        scope.top = 'N';
        scope.left = 'W';
        scope.right = 'E';
        scope.bottom = 'S';
    }
}));
