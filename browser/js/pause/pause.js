app.directive('pause', ($rootScope, RoomService) => ({
    restrict: 'E',
    templateUrl: 'js/pause/pause.html',
    replace: true,
    link(scope) {
        scope.paused = false;
        scope.roomNumber = '';

        $rootScope.$on('pause', () => {
            let room = RoomService.getRoom();

            if (room) {
                scope.roomNumber = room._id;
            }

            scope.paused = true;
            scope.$apply();
        });

        $rootScope.$on('unpause', () => {
            scope.paused = false;
            scope.$apply();
        });
    }
}));
