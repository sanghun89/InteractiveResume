app.directive('roomIdentifier', () => ({
    restrict: 'E',
    templateUrl: 'js/room-identifier/room-identifier.html',
    replace: true,
    link() {
        console.log(socketio);
    }
}));
