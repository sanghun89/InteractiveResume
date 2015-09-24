app.directive('threeInit', ($window, Scene, $rootScope) => ({
    restrict : 'A',
    link(scope, element) {
        let loaded = false;

        $rootScope.$on('load-scene', () => {
            if (!loaded) {
                Scene.initScene(element);
                loaded = true;
                THREE.interactiveLoaded = true;
            }
        });

        THREE.DefaultLoadingManager.onProgress = (_, load, total) => {
            let loaded_perc = load/total;

            $rootScope.$broadcast('progress', {
                loaded_perc : Math.round(loaded_perc * 100)
            });
        };
    }
}));
