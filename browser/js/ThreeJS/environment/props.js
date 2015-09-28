app.factory('Props', (WorldConstants, BallActions) => ({
    init() {
        this.three_default_material = this.three_default_material || new THREE.MeshLambertMaterial({ color : WorldConstants.GROUND_COLOR});
        this.three_alt_material = this.three_alt_material || new THREE.MeshLambertMaterial({ color : WorldConstants.GROUND_COLOR_ALT});

        this.default_material = this.default_material || Physijs.createMaterial(
            this.three_default_material,
            WorldConstants.DEFAULT_FRICTION,
            WorldConstants.DEFAULT_RESTITUTION
        );

        this.default_sides = this.default_sides || _.chain().range(6).map(() => this.three_default_material).value();
        this.alt_sides = this.alt_sides || _.chain().range(6).map(() => this.three_alt_material).value();

        this.default_geo = this.default_geo || new THREE.BoxGeometry(
            WorldConstants.GROUND_WIDTH,
            2,
            WorldConstants.GROUND_LENGTH,
            1,1,1
        );
    },
    cloneSides(alt) {
        let sides = this.default_sides;

        if (alt) {
            sides = this.alt_sides;
        }

        return _.map(sides, side => side);
    },
    _makeCenterPiece() {
        /* -------- Center ------- */
        let center_sides = this.cloneSides();

        let textures = {
            _default : THREE.ImageUtils.loadTexture('images/center-piece.png'),
            _work : THREE.ImageUtils.loadTexture('images/center-piece-work.jpg'),
            _toolsets : THREE.ImageUtils.loadTexture('images/center-piece-toolsets.jpg'),
            _edu : THREE.ImageUtils.loadTexture('images/center-piece-edu.jpg'),
            _skills : THREE.ImageUtils.loadTexture('images/center-piece-skills.jpg')
        };

        center_sides[2] = new THREE.MeshLambertMaterial({
            map: textures._default
        });
        center_sides[2].map.minFilter = THREE.LinearFilter;

        let center_mat = new THREE.MeshFaceMaterial(center_sides);

        let center_geo = new THREE.BoxGeometry(
            WorldConstants.GROUND_WIDTH/3,
            1,
            WorldConstants.GROUND_LENGTH/3,
            1,1,1
        );

        let center = new THREE.Mesh(
            center_geo,
            center_mat
        );

        BallActions.centerMesh = center;
        BallActions.centerTextures = textures;

        /* -------- Top ------- */
        let top_sides = this.cloneSides();
        top_sides[2] = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/education.png')
        });

        top_sides[2].map.minFilter = THREE.LinearFilter;

        let top_mat = new THREE.MeshFaceMaterial(top_sides);
        let top = new THREE.Mesh(
            center_geo,
            top_mat
        );

        top.position.z = -WorldConstants.GROUND_WIDTH/3;
        top.receiveShadow = true;
        center.add(top);

        /* -------- Bottom ------- */
        let bottom_sides = this.cloneSides();
        bottom_sides[2] = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/experience.png')
        });

        bottom_sides[2].map.minFilter = THREE.LinearFilter;

        let bottom_mat = new THREE.MeshFaceMaterial(bottom_sides);
        let bottom = new THREE.Mesh(
            center_geo,
            bottom_mat
        );

        bottom.position.z = WorldConstants.GROUND_WIDTH/3;
        bottom.receiveShadow = true;
        center.add(bottom);

        /* -------- Left ------- */
        let left_sides = this.cloneSides();
        left_sides[2] = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/skills.png')
        });

        left_sides[2].map.minFilter = THREE.LinearFilter;

        let left_mat = new THREE.MeshFaceMaterial(left_sides);
        let left = new THREE.Mesh(
            center_geo,
            left_mat
        );

        left.position.x = -WorldConstants.GROUND_WIDTH/3;
        left.receiveShadow = true;
        center.add(left);

        /* -------- Right ------- */
        let right_sides = this.cloneSides();
        right_sides[2] = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/toolsets.png')
        });

        right_sides[2].map.minFilter = THREE.LinearFilter;

        let right_mat = new THREE.MeshFaceMaterial(right_sides);
        let right = new THREE.Mesh(
            center_geo,
            right_mat
        );

        right.position.x = WorldConstants.GROUND_WIDTH/3;
        right.receiveShadow = true;
        center.add(right);

        /* -------- Corners ------- */
        let corners = [
          [1, 1],
          [1, -1],
          [-1, -1],
          [-1, 1]
        ], mesh;

        _.forEach(corners, (corner) => {
            mesh = new THREE.Mesh(
                center_geo,
                this.three_default_material
            );

            mesh.position.x = corner[0] * WorldConstants.GROUND_WIDTH / 3;
            mesh.position.z = corner[1] * WorldConstants.GROUND_LENGTH / 3;
            mesh.receiveShadow = true;
            center.add(mesh);
        });

        center.position.y = 0.5;
        center.receiveShadow = true;

        return center;
    },
    _makeTargets() {
        let target_geo = new THREE.CylinderGeometry(WorldConstants.TARGET_RADIUS, WorldConstants.TARGET_RADIUS, WorldConstants.TARGET_HEIGHT, 32);
        let target_mat = new THREE.MeshLambertMaterial( {color: WorldConstants.TARGET_COLOR} );
        let cylinders = _.chain().range(4).map((_, i) => {
            let cylinder = new THREE.Mesh( target_geo, target_mat);
            let axis = i < 2 ? 'x' : 'z';
            let direction = i % 2 === 0 ? -1 : 1;

            cylinder.position[axis] = direction * WorldConstants.GROUND_WIDTH / 2.5;
            cylinder.receiveShadow = true;

            return cylinder;
        }).value();

        return cylinders;
    },
    _makeToolset() {
        let toolset_sides = this.cloneSides(true);
        toolset_sides[2] = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/toolsets-block.png')
        });

        toolset_sides[2].map.minFilter = THREE.LinearFilter;

        let toolset_mat = new THREE.MeshFaceMaterial(toolset_sides);
        let toolset = new THREE.Mesh(
            this.default_geo,
            toolset_mat
        );

        toolset.position.x = WorldConstants.GROUND_WIDTH;
        toolset.position.y = WorldConstants.WALL_HEIGHT;
        toolset.receiveShadow = true;

        return toolset;
    },
    _makeSkills() {
        let skills_sides = this.cloneSides(true);
        skills_sides[2] = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/skills-block.png')
        });

        skills_sides[2].map.minFilter = THREE.LinearFilter;

        let skills_mat = new THREE.MeshFaceMaterial(skills_sides);
        let skills = new THREE.Mesh(
            this.default_geo,
            skills_mat
        );

        skills.position.x = -WorldConstants.GROUND_WIDTH;
        skills.position.y = WorldConstants.WALL_HEIGHT;
        skills.receiveShadow = true;

        return skills;
    },
    _makeExperience() {
        let exp_sides = this.cloneSides();
        exp_sides[2] = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/experience-block.png')
        });

        exp_sides[2].map.minFilter = THREE.LinearFilter;

        let exp_mat = new THREE.MeshFaceMaterial(exp_sides);
        let exp = new THREE.Mesh(
            this.default_geo,
            exp_mat
        );

        exp.position.z = WorldConstants.GROUND_WIDTH;
        exp.position.y = WorldConstants.WALL_HEIGHT;
        exp.receiveShadow = true;

        return exp;
    },
    _makeEducation() {
        let edu_sides = this.cloneSides();
        edu_sides[2] = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/education-block.png')
        });

        edu_sides[2].map.minFilter = THREE.LinearFilter;

        let edu_mat = new THREE.MeshFaceMaterial(edu_sides);
        let edu = new THREE.Mesh(
            this.default_geo,
            edu_mat
        );

        edu.position.z = -WorldConstants.GROUND_WIDTH;
        edu.position.y = WorldConstants.WALL_HEIGHT;
        edu.receiveShadow = true;

        return edu;
    },
    gather() {
        this.init();

        return _.reduce(Object.keys(this), (collection, func) => {
            if (func[0] === '_') {
                collection.push(this[func]());
            }
            return collection;
        }, []);
    }

}));
