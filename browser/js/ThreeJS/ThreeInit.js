app.directive('threeInit', ($window, Scene) => ({
    restrict : 'A',
    link(_, element) {
        Scene.initScene(element);
        console.log(Scene);
        console.log(element);
    }
}));
