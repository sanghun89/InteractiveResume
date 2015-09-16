app.factory('Camera', () => ({
    makeCamera() {
        let camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );

        return camera;
    }
}));
