app.directive('arrows', () =>({
    restrict: 'E',
    templateUrl: 'js/arrows/arrows.html',
    transclude: true,
    replace: true,
    link(scope) {
        if (scope.orientation === 0) {
            scope.top = 'E'; // E
            scope.left = 'N'; // N
            scope.right = 'S'; // S
            scope.bottom = 'W'; // W
        }

        if (window.orientation === -90) {
            scope.top = 'N'; // N
            scope.left = 'W'; // W
            scope.right = 'E'; // E
            scope.bottom = 'S'; // S
        }

        if (window.orientation === 90) {
            scope.top = 'S'; // N
            scope.left = 'E'; // W
            scope.right = 'W'; // E
            scope.bottom = 'N'; // S
        }


        window.addEventListener('orientationchange', () => {
            if (window.orientation === 0) {
                scope.top = 'E'; // E
                scope.left = 'N'; // N
                scope.right = 'S'; // S
                scope.bottom = 'W'; // W
            }

            if (window.orientation === -90) {
                scope.top = 'N'; // N
                scope.left = 'W'; // W
                scope.right = 'E'; // E
                scope.bottom = 'S'; // S
            }

            if (window.orientation === 90) {
                scope.top = 'S'; // N
                scope.left = 'E'; // W
                scope.right = 'W'; // E
                scope.bottom = 'N'; // S
            }

            scope.$apply();
        });
    }
}));
