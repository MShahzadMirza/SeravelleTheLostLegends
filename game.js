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
    // FIRST ENEMY
    // ========================================

    let enemy = BABYLON.MeshBuilder.CreateBox(
        "enemy",
        {
            width: 1.5,
            height: 2,
            depth: 1.5
        },
        scene
    );

    enemy.position = new BABYLON.Vector3(0, 1, 5);

    let enemyMaterial = new BABYLON.StandardMaterial(
        "enemyMaterial",
        scene
    );

    enemyMaterial.diffuseColor =
        new BABYLON.Color3(0.7, 0.1, 0.1);

    enemy.material = enemyMaterial;

    console.log("👹 ENEMY CREATED!");

    // ========================================
    // ENEMY HEALTH
    // ========================================

    let enemyHealth = 100;

    let playerHealth = 100;
    let enemyAttackCooldown = 0;

    console.log("❤️ Enemy HP:", enemyHealth);

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
    // WORLD GROUND
    // ========================================

    // Main grass ground
    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        {
            width: 120,
            height: 120
        },
        scene
    );


    // ========================================
    // GRASS MATERIAL
    // ========================================

    const groundMaterial = new BABYLON.StandardMaterial(
        "groundMaterial",
        scene
    );

    groundMaterial.diffuseColor =
        new BABYLON.Color3(0.25, 0.55, 0.25);

    ground.material = groundMaterial;


    // ========================================
    // MAIN DIRT PATH
    // ========================================

    const path = BABYLON.MeshBuilder.CreateGround(
        "mainPath",
        {
            width: 8,
            height: 120
        },
        scene
    );

    path.position.y = 0.01;


    // ========================================
    // STARTING CLEARING
    // ========================================

    const clearing = BABYLON.MeshBuilder.CreateDisc(
        "startingClearing",
        {
            radius: 10,
            tessellation: 48
        },
        scene
    );

    clearing.rotation.x = Math.PI / 2;

    clearing.position.y = 0.02;


    // ========================================
    // CLEARING MATERIAL
    // ========================================

    const clearingMaterial = new BABYLON.StandardMaterial(
        "clearingMaterial",
        scene
    );

    clearingMaterial.diffuseColor =
        new BABYLON.Color3(0.32, 0.60, 0.28);

    clearing.material = clearingMaterial;


    // ========================================
    // PATH MATERIAL
    // ========================================

    const pathMaterial = new BABYLON.StandardMaterial(
        "pathMaterial",
        scene
    );

    pathMaterial.diffuseColor =
        new BABYLON.Color3(0.45, 0.30, 0.18);

    path.material = pathMaterial;
    // ========================================
    // WORLD OBJECTS
    // ========================================

    // ========================================
    // ROCK FUNCTION
    // ========================================

    function createRock(x, z, size = 1) {

        const rock = BABYLON.MeshBuilder.CreateSphere(
            "rock",
            {
                diameter: 2
            },
            scene
        );

        rock.position = new BABYLON.Vector3(
            x,
            size,
            z
        );

        rock.scaling = new BABYLON.Vector3(
            size,
            size * 0.7,
            size
        );

        return rock;
    }


    // ========================================
    // TREE FUNCTION
    // ========================================

    function createTree(x, z, size = 1) {

        // Tree trunk
        const trunk = BABYLON.MeshBuilder.CreateCylinder(
            "treeTrunk",
            {
                height: 5,
                diameter: 1
            },
            scene
        );

        trunk.position = new BABYLON.Vector3(
            x,
            2.5 * size,
            z
        );

        trunk.scaling = new BABYLON.Vector3(
            size,
            size,
            size
        );


        // Tree leaves
        const leaves = BABYLON.MeshBuilder.CreateSphere(
            "treeLeaves",
            {
                diameter: 5
            },
            scene
        );

        leaves.position = new BABYLON.Vector3(
            x,
            6 * size,
            z
        );

        leaves.scaling = new BABYLON.Vector3(
            size,
            size,
            size
        );

        return {
            trunk: trunk,
            leaves: leaves
        };
    }


    // ========================================
    // PLACE ROCKS
    // ========================================

    createRock(-12, 8, 1.2);
    createRock(14, 10, 0.8);
    createRock(-15, -8, 1);
    createRock(15, -12, 1.3);
    createRock(-18, 2, 0.7);
    createRock(18, 4, 1);


    // ========================================
    // PLACE TREES
    // ========================================

    // Left side of the clearing
    createTree(-14, 12, 1.2);
    createTree(-18, 7, 0.9);
    createTree(-16, -2, 1.1);
    createTree(-20, -8, 1.3);

    // Right side of the clearing
    createTree(14, 13, 1);
    createTree(18, 8, 1.2);
    createTree(16, -3, 0.9);
    createTree(20, -9, 1.1);

    // Far background
    createTree(-10, 22, 1.3);
    createTree(10, 24, 1.1);
    createTree(-20, 18, 0.9);
    createTree(20, 20, 1.2);


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
            // CHECK WARRIOR MESH HEIGHT
            // ========================================

            let lowestPoint = Infinity;
            let highestPoint = -Infinity;

            meshes.forEach(function (mesh) {

                const bounds = mesh.getBoundingInfo().boundingBox;

                const minY = bounds.minimumWorld.y;
                const maxY = bounds.maximumWorld.y;

                if (minY < lowestPoint) {
                    lowestPoint = minY;
                }

                if (maxY > highestPoint) {
                    highestPoint = maxY;
                }

            });

            console.log("🧍 Warrior lowest point:", lowestPoint);
            console.log("🧍 Warrior highest point:", highestPoint);


            // ========================================
            // STOP WARRIOR ANIMATIONS
            // ========================================

            if (scene.animationGroups.length > 0) {

                scene.animationGroups.forEach(function (animationGroup) {

                    console.log("🎬 Animation:", animationGroup.name);

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

    // ========================================
    // COMBAT INPUT
    // ========================================

    let isAttacking = false;

    canvas.addEventListener("pointerdown", function (event) {

        if (event.button === 0) {

            // Don't start another attack while attacking
            if (isAttacking) {
                return;
            }

            isAttacking = true;

            console.log("⚔️ SWORD SLASH!");
            // ========================================
            // CHECK ENEMY HIT
            // ========================================

            const distanceToEnemy =
                BABYLON.Vector3.Distance(
                    player.position,
                    enemy.position
                );

            console.log("📏 Distance to enemy:", distanceToEnemy);

            if (distanceToEnemy <= 3) {

                enemyHealth -= 25;

                console.log(
                    "💥 ENEMY HIT! HP:",
                    enemyHealth
                );
                // ========================================
                // ENEMY DEFEATED
                // ========================================

                if (enemyHealth <= 0) {

                    enemyHealth = 0;

                    enemy.setEnabled(false);

                    console.log("👹 ENEMY DEFEATED!");

                }

            }
            // Find the sword attack animation
            const attackAnimation =
                scene.getAnimationGroupByName(
                    "CharacterArmature|Sword_Slash"
                );

            if (attackAnimation) {

                attackAnimation.stop();

                attackAnimation.play(false);

                console.log("🗡️ Sword Slash animation playing!");

                // Wait until animation finishes
                attackAnimation.onAnimationGroupEndObservable.addOnce(
                    function () {

                        isAttacking = false;

                        console.log("✅ Attack finished!");

                    }
                );

            } else {

                console.log("❌ Sword Slash animation not found!");

                isAttacking = false;

            }

        }

    });
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
        warriorRoot.position.set(
            player.position.x,
            0,
            player.position.z
        );
        warriorRoot.rotation.y =
            player.rotation.y;


        // ========================================
        // CAMERA FOLLOWS PLAYER
        // ========================================

        camera.target = player.position;

        // ========================================
        // ENEMY AI - FOLLOW PLAYER
        // ========================================

        if (enemy.isEnabled()) {

            const enemyDirection =
                player.position.subtract(enemy.position);

            enemyDirection.y = 0;

            const enemyDistance =
                enemyDirection.length();

            console.log("👹 Enemy distance:", enemyDistance);

            // ========================================
            // ENEMY STOP DISTANCE
            // ========================================

            const stopDistance = 2.5;

            // Only move if enemy is outside stopping distance
            if (enemyDistance > stopDistance) {

                enemyDirection.normalize();

                const enemySpeed = 0.03;

                const distanceToMove =
                    Math.min(
                        enemySpeed,
                        enemyDistance - stopDistance
                    );

                enemy.position.x +=
                    enemyDirection.x * distanceToMove;

                enemy.position.z +=
                    enemyDirection.z * distanceToMove;

                enemy.rotation.y =
                    Math.atan2(
                        enemyDirection.x,
                        enemyDirection.z
                    );

            }
            // ========================================
            // ENEMY ATTACK
            // ========================================

            if (enemyDistance <= stopDistance) {

                if (enemyAttackCooldown <= 0) {

                    playerHealth -= 10;

                    // Don't let HP go below 0
                    if (playerHealth < 0) {
                        playerHealth = 0;
                    }

                    console.log(
                        "👹 ENEMY ATTACK! Player HP:",
                        playerHealth
                    );

                    // Player defeated
                    if (playerHealth <= 0) {

                        console.log("💀 PLAYER DEFEATED!");

                        playerHealth = 0;

                    }

                    enemyAttackCooldown = 60;
                }

            }
            // ========================================
            // ATTACK COOLDOWN
            // ========================================

            if (enemyAttackCooldown > 0) {

                enemyAttackCooldown--;

            }

        }

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


