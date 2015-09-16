app.factory('Lights', (WorldConstants) => ({
    _makeHemi() {
        let hemi = new THREE.HemisphereLight(0xFFFFFF, WorldConstants.GROUND_COLOR, 0.7);
        hemi.position.set(WorldConstants.LIGHT_DIR_X, WorldConstants.LIGHT_DIR_Y, WorldConstants.LIGHT_DIR_Z);

        return hemi;
    },
    _makeAmbient() {
        let ambient = new THREE.AmbientLight(WorldConstants.AMBIENT_COLOR, 0.4);

        return ambient;
    },
    gather() {
        return _.reduce(Object.keys(this), (collection, func) => {
            if (func[0] === '_') {
                collection.push(this[func]());
            }
            return collection;
        }, []);
    }
}));
