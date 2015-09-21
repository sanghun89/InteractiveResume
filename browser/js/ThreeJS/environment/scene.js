app.factory('Scene', (WorldConstants, Renderer, Planes, Camera, Lights, Props, Ball, BallActions) => ({
    initScene(element) {
        let renderer, scene, gravityVector, camera, lights, planes, controls, props, ball_pieces;
        //renderer, scene, camera, cameraControls, domElement, gravityVector, controls;
        //var clock = new THREE.Clock();

        renderer = Renderer.makeRenderer(element);
        scene = new Physijs.Scene;

        gravityVector = new THREE.Vector3( 0, WorldConstants.GRAVITY_Y, 0 );
        BallActions.gravityVector = gravityVector;

        scene.setGravity(gravityVector);

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

        // the ball
        ball_pieces = Ball.gather();
        _.forEach(ball_pieces, (ball_piece) => {
            if (ball_piece) {
                scene.add(ball_piece);
            }
        });

        // lights
        lights = Lights.gather();

        _.forEach(lights, (light) => {
            if (light) {
                scene.add(light);
            }
        });

        /* For Debugging, un-comment */
        //controls = new THREE.OrbitControls(camera);
        //controls.damping = 0.2;

        function render() {
            renderer.render( scene, camera );
        }

        function animate() {
            if (controls) {
                controls.update();
            }
            // Getting threejs's inner clock
            //var delta = clock.getDelta();

            BallActions.update();
            scene.simulate();
            render();

            requestAnimationFrame(animate);
        }

        if (controls) {
            controls.addEventListener('change', render);
        }

        BallActions.scene = scene;
        BallActions.camera = camera;

        render();
        animate();

        BallActions.initActions();

        THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };
    }
}));
