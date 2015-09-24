app.factory('Ball', (WorldConstants, BallActions) => ({
    makeBall() {
        let ball_mat = new THREE.MeshPhongMaterial({});
        ball_mat.map = THREE.ImageUtils.loadTexture('images/8ball.png');
        ball_mat.map.minFilter = THREE.LinearFilter;
        ball_mat.specular = new THREE.Color('white');
        ball_mat.shininess = 5;

        ball_mat = Physijs.createMaterial(
            ball_mat,
            WorldConstants.DEFAULT_FRICTION,
            0.8
        );

        let ball = new Physijs.SphereMesh(
            new THREE.SphereGeometry(WorldConstants.BALL_RADIUS, 32, 16),
            ball_mat,
            WorldConstants.BALL_WEIGHT
        );

        ball.castShadow = true;
        ball.receiveShadow = false;
        ball.__dirtyRotation = true;
        ball.__dirtyPosition = true;
        ball.rotation.z = 90 * Math.PI/180;
        ball.position.y = WorldConstants.BALL_RADIUS + 5;

        return ball;
    },
    makeBallShadow() {
        let light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
        light.castShadow = true;
        light.onlyShadow = true;
        light.shadowCameraLeft = -60;
        light.shadowCameraTop = -60;
        light.shadowCameraRight = 60;
        light.shadowCameraBottom = 60;
        light.shadowCameraNear = 20;
        light.shadowCameraFar = 200;
        light.shadowBias = -.0001;
        light.shadowMapWidth = light.shadowMapHeight = 2048;
        light.shadowDarkness = .7;

        return light;
    },
    gather() {
        let ball = this.makeBall();
        let ball_light = this.makeBallShadow();
        ball_light.position.set(-WorldConstants.BALL_RADIUS, Math.pow(WorldConstants.BALL_RADIUS, 3), -WorldConstants.BALL_RADIUS * 3);
        ball_light.target = ball;
        BallActions.ball = ball;
        BallActions.ball_light = ball_light;

        return [ball, ball_light];
    }
}));
