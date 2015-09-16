'use strict';
app.factory('Renderer', (WorldConstants) => ({
    makeRenderer(element) {
        var renderer = new THREE.WebGLRenderer({
            antialias : true
        });

        window.addEventListener('resize', () => {
            renderer.setSize( window.innerWidth, window.innerHeight);
        });

        renderer.setSize( window.innerWidth, window.innerHeight);
        renderer.setClearColor(WorldConstants.BACKGROUND_COLOR, 0.5);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.shadowMapType = THREE.PCFSoftShadowMap;

        element[0].appendChild(renderer.domElement);

        return renderer;
    }
}));
