app.factory('WorldConstants', function() {
    return {
        GROUND_WIDTH  : 100,
        GROUND_LENGTH : 100,
        WALL_HEIGHT: 50,
        PILLARS: {
            x : [1, -1],
            z : [1, -1]
        },
        TARGET_RADIUS: 2,
        TARGET_HEIGHT: 2.2,
        BALL_RADIUS: 3,
        BALL_SPEED_LIMIT: 25,
        ORIENTATION_OFFSET : 3,
        CAMERA_GAP: 90,
        CAMERA_OFFSET_Z: 5,
        GROUND_COLOR: 0xE0EDE1,
        BACKGROUND_COLOR: 0xBFBFBF,
        WALL_COLOR : 0xFACB47, //0xA0D36E,
        GROUND_COLOR_ALT: 0x865371,
        SKY_COLOR: 0xAAD1D8,
        BALL_COLOR : 0xFA6900,
        AMBIENT_COLOR: 0x4f4f4f,
        LIGHT_DIR_X: 10,
        LIGHT_DIR_Y: 20,
        LIGHT_DIR_Z: 12,
        GRAVITY_Y: -30,
        DEBUG_MODE: true
    };
});
