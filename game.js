// ========================================
// SERAVELLE: THE LOST LEGENDS
// VERSION 1
// STEP 2 - PLAYER
// ========================================

// Get the canvas
const canvas = document.getElementById("gameCanvas");

// Create Babylon engine
const engine = new BABYLON.Engine(canvas, true);


// ========================================
// CREATE SCENE
// ========================================

function createScene() {

    const scene = new BABYLON.Scene(engine);

    // ========================================
    // SKY
    // ========================================

    scene.clearColor = new BABYLON.Color4(
        0.55,
        0.75,
        0.95,
        1
    );


    // ========================================
    // THIRD-PERSON CAMERA
    // ========================================

    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 3,
        10,
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    camera.attachControl(canvas, true);

    camera.lowerRadiusLimit = 6;
    camera.upperRadiusLimit = 14;

    camera.lowerBetaLimit = 0.7;
    camera.upperBetaLimit = 1.4;

    camera.inertia = 0.8;

    camera.wheelDeltaPercentage = 0.01;
    // ========================================
    // LIGHT
    // ========================================

    const light = new BABYLON.HemisphericLight(
        "sunLight",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    light.intensity = 1.0;


    // ========================================
    // GROUND
    // ========================================

    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        {
            width: 100,
            height: 100
        },
        scene
    );

    const groundMaterial = new BABYLON.StandardMaterial(
        "groundMaterial",
        scene
    );

    groundMaterial.diffuseColor =
        new BABYLON.Color3(0.25, 0.55, 0.25);

    ground.material = groundMaterial;


    // ========================================
    // TEST ROCK
    // ========================================

    const rock = BABYLON.MeshBuilder.CreateSphere(
        "rock",
        {
            diameter: 3
        },
        scene
    );

    rock.position = new BABYLON.Vector3(5, 1.5, 5);


    // ========================================
    // TEST TREE
    // ========================================

    const trunk = BABYLON.MeshBuilder.CreateCylinder(
        "treeTrunk",
        {
            height: 5,
            diameter: 1
        },
        scene
    );

    trunk.position = new BABYLON.Vector3(-5, 2.5, 5);


    const leaves = BABYLON.MeshBuilder.CreateSphere(
        "treeLeaves",
        {
            diameter: 5
        },
        scene
    );

    leaves.position = new BABYLON.Vector3(-5, 6, 5);


    // ========================================
    // PLAYER
    // ========================================

    const player = BABYLON.MeshBuilder.CreateCapsule(
        "player",
        {
            height: 2,
            radius: 0.5
        },
        scene
    );

    player.position = new BABYLON.Vector3(0, 1, 0);


    // Player material
    const playerMaterial = new BABYLON.StandardMaterial(
        "playerMaterial",
        scene
    );

    playerMaterial.diffuseColor =
        new BABYLON.Color3(0.2, 0.2, 0.3);

    player.material = playerMaterial;


    // ========================================
    // PLAYER MOVEMENT
    // ========================================

    const keys = {};

    window.addEventListener("keydown", function (event) {
        keys[event.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", function (event) {
        keys[event.key.toLowerCase()] = false;
    });


    const walkSpeed = 0.12;
    const runSpeed = 0.24;


    // ========================================
    // GAME LOOP
    // ========================================

    scene.onBeforeRenderObservable.add(function () {

        let speed = walkSpeed;

        // Hold SHIFT to run
        if (keys["shift"]) {
            speed = runSpeed;
        }

        // Forward / backward
        if (keys["w"]) {
            player.position.z += speed;
        }

        if (keys["s"]) {
            player.position.z -= speed;
        }

        // Left / right
        if (keys["a"]) {
            player.position.x -= speed;
        }

        if (keys["d"]) {
            player.position.x += speed;
        }

        // Camera follows player
        camera.target = player.position;
    });


    return scene;
}


// ========================================
// START GAME
// ========================================

const scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});


// ========================================
// RESIZE
// ========================================

window.addEventListener("resize", function () {
    engine.resize();
});