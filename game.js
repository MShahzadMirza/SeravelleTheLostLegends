console.log("GAME.JS IS RUNNING");
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
    // PLAYER CONTROLLER
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


    // Hide the capsule.
    // It is only used as the movement controller.
    player.isVisible = false;


    // ========================================
    // WARRIOR ROOT
    // ========================================

    const warriorRoot = new BABYLON.TransformNode(
        "warriorRoot",
        scene
    );

    warriorRoot.position.copyFrom(player.position);


    // ========================================
    // LOAD WARRIOR MODEL
    // ========================================

    BABYLON.SceneLoader.ImportMesh(
        "",
        "assets/models/",
        "warrior.glb",
        scene,

        function (meshes) {

            console.log("✅ WARRIOR MODEL LOADED!");
            console.log("Meshes:", meshes);
            // ========================================
            // STOP WARRIOR ANIMATIONS
            // ========================================

            if (scene.animationGroups.length > 0) {

                scene.animationGroups.forEach(function (animationGroup) {
                    animationGroup.stop();
                });

                console.log("🛑 Warrior animations stopped.");
            }
            if (meshes.length === 0) {

                console.log(
                    "❌ Model loaded but contains no meshes."
                );

                player.isVisible = true;

                return;
            }


            // ========================================
            // ATTACH ONLY ROOT-LEVEL MESHES
            // ========================================
            //
            // We do NOT re-parent every mesh.
            // This keeps the GLB's internal hierarchy intact.
            //

            meshes.forEach(function (mesh) {

                if (mesh.parent === null) {

                    mesh.parent = warriorRoot;

                }

            });


            // ========================================
            // MAKE MODEL VISIBLE
            // ========================================

            meshes.forEach(function (mesh) {

                mesh.isVisible = true;

            });


            console.log("✅ Warrior attached to warriorRoot!");
        },


        null,


        // ========================================
        // LOADING ERROR
        // ========================================

        function (scene, message, exception) {

            console.log(
                "❌ WARRIOR MODEL FAILED TO LOAD!"
            );

            console.log(message);
            console.log(exception);

            // Show capsule if model fails.
            player.isVisible = true;
        }
    );


    // ========================================
    // PLAYER MOVEMENT
    // ========================================

    const keys = {};


    window.addEventListener(
        "keydown",
        function (event) {

            keys[event.key.toLowerCase()] = true;

        }
    );


    window.addEventListener(
        "keyup",
        function (event) {

            keys[event.key.toLowerCase()] = false;

        }
    );


    const walkSpeed = 0.12;
    const runSpeed = 0.24;


    // ========================================
    // GAME LOOP
    // ========================================

    scene.onBeforeRenderObservable.add(function () {


        // ========================================
        // SPEED
        // ========================================

        let speed = walkSpeed;


        // Hold SHIFT to run
        if (keys["shift"]) {

            speed = runSpeed;

        }


        // ========================================
        // CAMERA-RELATIVE MOVEMENT
        // ========================================

        let moveX = 0;
        let moveZ = 0;


        // Forward
        if (keys["w"]) {

            moveZ += 1;

        }


        // Backward
        if (keys["s"]) {

            moveZ -= 1;

        }


        // Left
        if (keys["a"]) {

            moveX -= 1;

        }


        // Right
        if (keys["d"]) {

            moveX += 1;

        }


        // ========================================
        // MOVE RELATIVE TO CAMERA
        // ========================================

        if (moveX !== 0 || moveZ !== 0) {


            // Get camera forward direction
            const forward =
                camera.getForwardRay().direction;


            // Keep movement on ground
            forward.y = 0;

            forward.normalize();


            // Get camera right direction
            const right = new BABYLON.Vector3(
                forward.z,
                0,
                -forward.x
            );


            // Calculate movement direction
            const direction =
                forward.scale(moveZ)
                    .add(right.scale(moveX));


            direction.normalize();


            // Move player controller
            player.position.addInPlace(
                direction.scale(speed)
            );


            // Turn player toward movement
            player.rotation.y =
                Math.atan2(
                    direction.x,
                    direction.z
                );

        }


        // ========================================
        // WARRIOR FOLLOWS PLAYER
        // ========================================

        warriorRoot.position.copyFrom(
            player.position
        );

        warriorRoot.rotation.y =
            player.rotation.y;


        // ========================================
        // CAMERA FOLLOWS PLAYER
        // ========================================

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

window.addEventListener(
    "resize",
    function () {

        engine.resize();

    }
);


