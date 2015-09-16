app.factory('Scene', (WorldConstants, Renderer, Planes, Camera, Lights, Props) => ({
    initScene(element) {
        let renderer, scene, camera, lights, planes, controls, props;
        //renderer, scene, camera, cameraControls, domElement, gravityVector, controls;
        //var clock = new THREE.Clock();

        renderer = Renderer.makeRenderer(element);
        scene = new Physijs.Scene;

        camera = Camera.makeCamera();
        camera.position.set(0, WorldConstants.CAMERA_GAP, WorldConstants.CAMERA_OFFSET_Z);
        camera.up.set(0, 1, 0);

        let camTarget = new THREE.Vector3(0, 0, 0);
        camera.lookAt(camTarget);

        scene.add(camera);

        // floors and walls
        planes = Planes.gather();
        planes.position.x = 0;
        planes.position.y = 0;
        planes.position.z = 0;

        scene.add(planes);

        // props
        props = Props.gather();
        _.forEach(props, (prop) => {
            if (prop) {
                if (Array.isArray(prop)) {
                    return _.forEach(prop, (p) => scene.add(p));
                }
                scene.add(prop);
            }
        });

        // lights
        lights = Lights.gather();

        _.forEach(lights, (light) => {
            if (light) {
                scene.add(light);
            }
        });

        controls = new THREE.OrbitControls(camera);
        controls.damping = 0.2;

        function render() {
            // Getting threejs's inner clock
            //var delta = clock.getDelta();

            renderer.render( scene, camera );
            //scene.simulate();
        }

        function animate() {
            controls.update();
            scene.simulate();
            renderer.render( scene, camera);

            requestAnimationFrame(animate);
        }

        controls.addEventListener('change', render);

        render();
        animate();

        THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };
    }
}));
