document.body.style.cursor = 'none'

/* three.js terrain */
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import * as CANNON from 'cannon-es';

// https://threejs.org/examples/?q=pointerlock#misc_controls_pointerlock

let path = 'Simon'

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;


let prevTime = performance.now();
const velocity = new THREE.Vector3(); //movement of camera
const direction = new THREE.Vector3(); //direction
const speed = 10;
const moveSpeed = 300 * 2.5;

// Canvas
const canvas = document.querySelector('canvas.webgl');
const clock = new THREE.Clock();


// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.y = 10;
camera.position.x = -56.026;
camera.position.z = -310.555;
camera.rotation.y = 4;


const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, renderer.domElement);

scene.add(controls.object); //add camera to the scene
const onKeyDown = function (event) {
    // console.log(event.code);

    switch (event.code) {


        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyD':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyA':
            moveRight = true;
            break;

        case 'Space':
            if (canJump === true) velocity.y += 200;
            canJump = false;
            break;

    }

};

const onKeyUp = function (event) {

    switch (event.code) {


        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyD':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyA':
            moveRight = false;
            break;

    }

};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

document.addEventListener('keydown', function (event) {
    if (event.code === 'KeyT') {
        if (path === 'Simon') {
            camera.position.y = 10;
            camera.position.x = 635.7920;
            camera.position.z = 11.0339;

            path = 'Daniel';
        } else {
            camera.position.y = 10;
            camera.position.x = -56.026;
            camera.position.z = -310.555;

            path = 'Simon';
        }
    }
});


document.addEventListener('click', function () {


    controls.lock();

});

controls.addEventListener('lock', function () {
    console.log("locked");

});


// Models
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

// Directional Lights
const lightIntensity = 2.5;

// North-facing light
const northLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
northLight.position.set(0, 100, -100);
scene.add(northLight);

// South-facing light
const southLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
southLight.position.set(0, 100, 100);
scene.add(southLight);

// West-facing light
const westLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
westLight.position.set(-100, 100, 0);
scene.add(westLight);

// East-facing light (casts shadows)
const eastLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
eastLight.position.set(100, 100, 0);
eastLight.castShadow = true;
eastLight.shadow.mapSize.width = 1024; // Shadow resolution
eastLight.shadow.mapSize.height = 1024;
eastLight.shadow.camera.near = 0.5;
eastLight.shadow.camera.far = 500;
scene.add(eastLight);

// Raycasting
const raycaster = new THREE.Raycaster();
const collisionObjects = [];





//Daniels'Models





gltfLoader.load(
    'static/models/Path/Path1/Path.gltf',
    (gltf) => {
        console.log('success ')
        let modelArray = gltf.scene.children;


        modelArray.forEach(mesh => {
            //console.log("tetstststs")
            //console.log(mesh.name);
            mesh.scale.set(3, 3, 3);
            mesh.position.y += 2.2;
            mesh.position.x += 5;
            mesh.position.z += -260;

            function allDescendents(node) {
                for (let i = 0; i < node.children.length; i++) {
                    let child = node.children[i];
                    console.log(child.name);
                    allDescendents(child);
                    //the name does not wqual as it is _1, _2 ...
                    if (child.isMesh && child.name.startsWith('WallRooft')) {
                        //  console.log("herer")
                        collisionObjects.push(child);
                    }
                }
            }

            allDescendents(mesh);

        });
        for (const childmodel of modelArray) {
            scene.add(childmodel)
        }
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
);

gltfLoader.load(
    'static/models/Path/Path2/Daniel.gltf',
    (gltf) => {
        console.log('Path2 loaded successfully')
        let modelArray = gltf.scene.children;


        modelArray.forEach(mesh => {
            // console.log("tetstststs")
            //console.log(mesh.name);
            mesh.scale.set(12, 12, 12);
            mesh.position.y += 7;
            mesh.position.x += 800;


            function allDescendents(node) {
                for (let i = 0; i < node.children.length; i++) {
                    let child = node.children[i];
                    console.log(child.name);
                    allDescendents(child);
                    if (child.isMesh) {
                        collisionObjects.push(child);
                    }
                }
            }

            allDescendents(mesh);

        });
        for (const childmodel of modelArray) {
            scene.add(childmodel)
        }
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
);

gltfLoader.load(
    'static/models/Path/Floor2/Daniel.gltf',
    (gltf) => {
        console.log('Floor loaded successfully ')
        let modelArray = gltf.scene.children;


        modelArray.forEach(mesh => {
            // console.log("tetstststs")
            //console.log(mesh.name);
            mesh.scale.set(12, 12, 12);
            mesh.position.y += 7;
            mesh.position.x += 800;


        });
        for (const childmodel of modelArray) {
            scene.add(childmodel)
        }
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
);

const interactiveObjects = [];

gltfLoader.load(
    'static/models/Path/car/Daniel.gltf',
    (gltf) => {
        console.log('Car loaded successfully')
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            // console.log("tetstststs")
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 10.2;
            mesh.position.x = 704;
            mesh.position.z = 121;
            mesh.name = "Dream Car";
            mesh.description = "My dream car, Growing up my dad always had his iconic black GTI rabbit. when we moved to Canada he ended up selling it and I never got a chance to drive it. Afew years ago he got a mustang and ever since I have fallen in awe of the machine and one day wish to be able to get my own.";
            interactiveObjects.push(mesh);
        });

        for (const childmodel of modelArray) {
            scene.add(childmodel)
        }
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
);


gltfLoader.load(
    'static/models/Path/Items/Figurine/Figurine.gltf',
    (gltf) => {
        console.log('Figurine loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 2;
            mesh.position.x = 800;
            mesh.position.z = 9;
            mesh.name = "Figurine Model";
            mesh.description = "These are two of my characters for one of the projects my friends and I are trying to make. In the story these two end up falling in love and forming and unstopable team. Watching eachothers backs and trustung one another with theirs lives.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);
        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Doki/Rambo.gltf',
    (gltf) => {
        console.log('Doki loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2.1, 2.1, 2.1);
            mesh.position.y += 6;
            mesh.position.x = 923;
            mesh.position.z = -80;
            mesh.rotation.y = -Math.PI / 2;
            mesh.name = "Doki";
            mesh.description = "Back in mexico when I was litle we got a dog in a carnaval and my sister and I decided to call him Doki. He was a massive powerful and fierce Rottweiller yet I have nothing but fond and loving memories of him. Sadly he passed away alone protecting our house in mexico I will never forget him.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);
        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }

);

gltfLoader.load(
    'static/models/Path/Items/Rambo/Rambo.gltf',
    (gltf) => {
        console.log('Rambo loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 6;
            mesh.position.x = 923;
            mesh.position.z = -60;
            mesh.rotation.y = -Math.PI / 2;
            mesh.name = "Rambo";
            mesh.description = "A year ago I got a puppy, A two months old Rottweiller puppy. i have always loved Rottwellers since I have very fond memories of one. Rambo has very quickly become one of the most important parts of my life.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);
        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Mask/Mask.gltf',
    (gltf) => {
        console.log('Mask loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(.5, .5, .5);
            mesh.position.y += -4.5;
            mesh.position.x = 923;
            mesh.position.z = -100;
            mesh.rotation.y = -Math.PI / 2;
            mesh.name = "Mask";
            mesh.description = "I recently got a 3D printer and I have been printing so many different things. This mask is the first piece that I have printed and i can actually wear. i will try to eventually make a full medieval knight suit of armor out of PLA for renfairs and halloween.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);
        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/frame1/Frame1.gltf',
    (gltf) => {
        console.log('frame1 loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 17;
            mesh.position.x = 933;
            mesh.position.z = -120;
            mesh.rotation.y = Math.PI;
            mesh.rotation.x = Math.PI / 2;
            mesh.rotation.z = -Math.PI / 2;
            mesh.name = "Futuristic hangar";
            mesh.description = "This is one of the scenes in the biggest project my friends and I have been working on. we have spent so much time effort and money trying to make our dream come true.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);
        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/frame2/Frame1.gltf',
    (gltf) => {
        console.log('frame2 loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 17;
            mesh.position.x = 933;
            mesh.position.z = -145;
            mesh.rotation.y = Math.PI;
            mesh.rotation.x = -Math.PI / 2;
            mesh.rotation.z = -Math.PI / 2;
            mesh.name = "Aztec temple";
            mesh.description = "I am very proud of my roots, I will always be mexican no matter where I go or live and I will always have inmense respect for it as a country despite all of it problems.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);
        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/frame3/Frame1.gltf',
    (gltf) => {
        console.log('frame3 loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 17;
            mesh.position.x = 933;
            mesh.position.z = -170;
            mesh.rotation.y = Math.PI;
            mesh.rotation.x = -Math.PI / 2;
            mesh.rotation.z = -Math.PI / 2;
            mesh.name = "The last supper";
            mesh.description = "A few years ago i decided to create this image in reference to Leonardo DaVinci painting. It is purely comical and I really like how it turned out.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/frame4/Frame1.gltf',
    (gltf) => {
        console.log('frame4 loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(8, 8, 8);
            mesh.position.y += 34;
            mesh.position.x = 880;
            mesh.position.z = -120;
            mesh.rotation.y = Math.PI;
            mesh.rotation.x = -Math.PI / 2;
            mesh.rotation.z = Math.PI / 2;
            mesh.name = "Characters";
            mesh.description = "These are all of the characters I have created so far. all witht heir corresponding abilities, weapons and stories. I have spent so much time learning to use blender in order to create them.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Frame5/Frame1.gltf',
    (gltf) => {
        console.log('frame5 loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 17;
            mesh.position.x = 805;
            mesh.position.z = -71.1;
            mesh.rotation.z = -Math.PI / 2;
            mesh.name = "PyreNova";
            mesh.description = "This is the main character, this is the one all my advancements and effort goes through I am so proud of him and how he turned out.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Frame6/Frame1.gltf',
    (gltf) => {
        console.log('frame6 loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 17;
            mesh.position.x = 850;
            mesh.position.z = -71.1;
            mesh.rotation.z = -Math.PI / 2;
            mesh.name = "Oposites";
            mesh.description = "In the story these two start off hating eachother, as the story goes on they get to know eachother and their faults and work together against many enemies complimenting one another.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Weapon1/Untitled.gltf',
    (gltf) => {
        console.log('Axe loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 2;
            mesh.position.x = 865;
            mesh.position.z = -155;
            mesh.rotation.y = -Math.PI / 2;
            mesh.name = "Rhino Axe";
            mesh.description = "A double sided axe, The weapon of choice of the Rhinoceros a Dendro and Pyro Titan.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Weapon2/Untitled.gltf',
    (gltf) => {
        console.log('Spear loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 2;
            mesh.position.x = 845;
            mesh.position.z = -85;
            mesh.rotation.y = -Math.PI;
            mesh.name = "Dendro Spear";
            mesh.description = "This is the main weapon of the element of Dendro. A powerful and deadly weapon that helps the user harness the streanght of the element they wield.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Weapon3/Untitled.gltf',
    (gltf) => {
        console.log('Bow loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 2;
            mesh.position.x = 865;
            mesh.position.z = -95;
            mesh.rotation.y = -Math.PI / 2;
            mesh.name = "Aero Bowr";
            mesh.description = "This is the Bow of the element Aero. The user relies on their abiliteis to create the arrows and with perfect precision it is one of the deadliest weapons as it is one of few weapons made for long range.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Weapon4/Untitled.gltf',
    (gltf) => {
        console.log('Fans loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 2;
            mesh.position.x = 865;
            mesh.position.z = -110;
            mesh.rotation.y = -Math.PI / 2;
            mesh.name = "Owl Fans";
            mesh.description = "A sec of two fans that each have tree blades in them. an elegand weapon for whoever wields them.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Weapon5/Untitled.gltf',
    (gltf) => {
        console.log('Claws loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 2;
            mesh.position.x = 865;
            mesh.position.z = -125;
            mesh.rotation.y = -Math.PI / 2;
            mesh.name = "Wolf Claws";
            mesh.description = "Two sets of claws, the more alies the user has the deadlier they become enabling it to exponentially grow in power.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Weapon6/Untitled.gltf',
    (gltf) => {
        console.log('Bomerang loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 2;
            mesh.position.x = 865;
            mesh.position.z = -140;
            mesh.rotation.y = -Math.PI / 2;
            mesh.name = "kangaroo Bomerang";
            mesh.description = "A bomerang Precice and with a perfect mental link with the user. It is beleived to have a mind of its own to ensure the user will be done.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Weapon7/Untitled.gltf',
    (gltf) => {
        console.log('Sword loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 2;
            mesh.position.x = 830;
            mesh.position.z = -85;
            mesh.rotation.y = -Math.PI;
            mesh.name = "Pyro Blade";
            mesh.description = "The Pyro blade and indestructible and powerful weapon. Used as the main weapon of the pyro element, combined with the users strenght it is capable of cutting through anything.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Weapon8/Untitled.gltf',
    (gltf) => {
        console.log('Rings loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 2;
            mesh.position.x = 815;
            mesh.position.z = -85;
            mesh.rotation.y = -Math.PI;
            mesh.name = "Hydro Rings";
            mesh.description = "The main weapon of the hydro element, a weapon that require a perfect mastery and concentration that enables the user to become an unpredictable and deadly assasin.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Weapon9/Untitled.gltf',
    (gltf) => {
        console.log('Staff loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 2;
            mesh.position.x = 800;
            mesh.position.z = -85;
            mesh.rotation.y = -Math.PI;
            mesh.name = "Solaris Staff";
            mesh.description = "The Solaris element main weapon. Enhances the users ability to manipulate light and change what the users sees. Enabling the user to overpower their enemies without even landing a single blow.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Weapon10/Untitled.gltf',
    (gltf) => {
        console.log('Scythe loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 2;
            mesh.position.x = 785;
            mesh.position.z = -85;
            mesh.rotation.y = -Math.PI;
            mesh.name = "Tenebra Scythe";
            mesh.description = "The main weapon of the Tenebrae element. A weapon of inmense power capable of phasing through the void and enabling the user to travel through shadows. It has een seen being used to to kill with a single touch.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

gltfLoader.load(
    'static/models/Path/Items/Logo/Untitled.gltf',
    (gltf) => {
        console.log('Logo loaded successfully');
        let modelArray = gltf.scene.children;

        modelArray.forEach(mesh => {
            mesh.scale.set(4, 4, 4);
            mesh.position.y += 2;
            mesh.position.x = 769;
            mesh.position.z = -167;
            mesh.rotation.y = Math.PI / 4;
            mesh.name = "Logo";
            mesh.description = "This is my logo, I have made it to represent a flame. I have always been hypnotized by fire whicc made me turn it into a major part of my personality and who I am.";
            interactiveObjects.push(mesh);
        });

        modelArray.forEach(childmodel => {
            scene.add(childmodel);

        });
    },
    (progress) => {
        console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

// Detect if the cursor is looking at an object and close enough
const raycasterD = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseDown(event) {
    if (event.button === 0) { // Check if the left mouse button is clicked
        raycasterD.setFromCamera(mouse, camera);
        const intersects = raycasterD.intersectObjects(interactiveObjects);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            const distance = intersects[0].distance;

            if (distance < 15) { // Increased interaction distance
                showInfoWindow(object); // Show information about the object
            }
        }
    }
}

function showInfoWindow(object) {
    const infoWindow = document.createElement('div');
    infoWindow.style.position = 'absolute';
    infoWindow.style.top = '0';
    infoWindow.style.left = '0';
    infoWindow.style.width = '300px';
    infoWindow.style.height = '100%';
    infoWindow.style.padding = '20px';
    infoWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    infoWindow.style.color = 'white';
    infoWindow.style.borderRight = '2px solid white';
    infoWindow.style.overflowY = 'auto';
    infoWindow.innerHTML = `
        <h2>Object Information</h2>
        <p>Name: ${object.parent.name || 'Unnamed Object'}</p>
        <p>Description: ${object.parent.description}</p>
        <p>Press "X" to close this window.</p>
    `;
    document.body.appendChild(infoWindow);

    function closeInfoWindow(event) {
        if (event.code === 'KeyX') {
            document.body.removeChild(infoWindow);
            document.removeEventListener('keydown', closeInfoWindow);
        }
    }

    document.addEventListener('keydown', closeInfoWindow);
}

// Expand the bounding boxes of interactive objects for easier clicking
interactiveObjects.forEach(mesh => {
    if (mesh.geometry) {
        mesh.geometry.computeBoundingBox();
        const boundingBox = mesh.geometry.boundingBox.clone();
        boundingBox.expandByScalar(2); // Expand the bounding box
        mesh.geometry.boundingBox = boundingBox;
    }
});

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mousedown', onMouseDown);





//Simon's Models





// Define chair configurations
const chairConfigs = [
    {
        position: { x: -70.5, y: 0.5, z: -328 },
        rotationY: Math.PI / 4, // Rotate 45 degrees
        scale: { x: 8, y: 8, z: 8 }
    },
    {
        position: { x: -77, y: 0.5, z: -309 },
        rotationY: Math.PI / 2, // Rotate 90 degrees
        scale: { x: 8, y: 8, z: 8 }
    },
    {
        position: { x: -52, y: 0.5, z: -335 },
        rotationY: Math.PI * 2, // 
        scale: { x: 8, y: 8, z: 8 }
    }
];

// Load and configure chairs
gltfLoader.load(
    'static/models/Simon Models/Chair/ArmChair_01_1k.gltf', // Path to the chair model
    (gltf) => {
        console.log('Chair models loaded successfully');

        chairConfigs.forEach((config) => {
            // Clone the chair model for each configuration
            const chair = gltf.scene.clone();

            // Set position
            chair.position.set(config.position.x, config.position.y, config.position.z);

            // Set rotation
            chair.rotation.y = config.rotationY;

            // Set scale
            chair.scale.set(config.scale.x, config.scale.y, config.scale.z);

            // Add the chair to the scene
            scene.add(chair);
        });
    },
    (progress) => {
        console.log('Loading chair models progress:', progress);
    },
    (error) => {
        console.error('Error loading chair models:', error);
    }
);



/** Soap Box Exhibit */

/** Soap Box Table */
// Load and configure table
gltfLoader.load(
    'static/models/Simon Models/Table/side_table_tall_01_1k.gltf', // Replace with the actual path to your table model
    (gltf) => {
        console.log('Table model loaded successfully');

        // Access the table model
        const table = gltf.scene;

        // Set the position of the table
        table.position.set(335, 0.5, -210);

        // Optionally set the scale if needed
        table.scale.set(10, 7, 10); // Adjust scale as necessary

        // Add the table to the scene
        scene.add(table);
    },
    (progress) => {
        console.log('Loading table model progress:', progress);
    },
    (error) => {
        console.error('Error loading table model:', error);
    }
);

/** Soap Box Model */

let soapBox; // Declare the soap box globally so it can be accessed in the animation loop

gltfLoader.load(
    'static/models/Simon Models/SoapBox/soapbox-asset.gltf', // Replace with the actual path to your soap box model
    (gltf) => {
        console.log('Soap box model loaded successfully');

        // Access the soap box model
        soapBox = gltf.scene;

        // Load the texture
        const soapBoxTexture = textureLoader.load(
            'static/models/Simon Models/SoapBox/soapbox_texture.png', // Replace with the correct path to your PNG
            () => console.log('Texture loaded successfully'),
            undefined,
            (error) => console.error('Error loading texture:', error)
        );

        // Apply the texture to the soap box material
        soapBox.traverse((child) => {
            if (child.isMesh) {
                child.material.map = soapBoxTexture;
                child.material.needsUpdate = true;
            }
        });

        // Set the position of the soap box relative to the table
        soapBox.position.set(335, 8.5, -210); // Adjust Y to place it on top of the table

        // Optionally set the scale if needed
        soapBox.scale.set(3.5, 3.5, 3.5); // Adjust scale as necessary

        // Add the soap box to the scene
        scene.add(soapBox);
    },
    (progress) => {
        console.log('Loading soap box model progress:', progress);
    },
    (error) => {
        console.error('Error loading soap box model:', error);
    }
);

/** Soap Box Photos */

gltfLoader.load(
    'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf', // Replace with the actual path to your frame model
    (gltf) => {
        console.log('Frame model loaded successfully');

        // Access the frame model
        const frame = gltf.scene;

        // Scale the frame to make it larger
        frame.scale.set(40, 40, 40); // Adjust scale as necessary

        // Set the position of the frame
        frame.position.set(362, 13, -195); // Adjust position as necessary

        // Rotate the frame to face the camera
        frame.rotation.y = -Math.PI / 2; // Rotate 90 degrees to face the camera

        // Add the frame to the scene
        scene.add(frame);

        // Create a plane for the photo
        const photoGeometry = new THREE.PlaneGeometry(0.55, 0.39); // Adjust width and height to fit the frame
        const photoTexture = textureLoader.load(
            'static/models/Simon Models/frame/soapbox_texture.png', // Replace with the path to your PNG
            () => console.log('Photo texture loaded successfully'),
            undefined,
            (error) => console.error('Error loading photo texture:', error)
        );
        const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
        const photo = new THREE.Mesh(photoGeometry, photoMaterial);

        // Position the photo inside the frame
        photo.position.set(0, 0, 0.01); // Adjust Z to place it slightly in front of the frame
        frame.add(photo); // Add the photo as a child of the frame
    },
    (progress) => {
        console.log('Loading frame model progress:', progress);
    },
    (error) => {
        console.error('Error loading frame model:', error);
    }
);

gltfLoader.load(
    'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf', // Replace with the actual path to your frame model
    (gltf) => {
        console.log('Second frame model loaded successfully');

        // Access the second frame model
        const secondFrame = gltf.scene;

        // Scale the second frame to match the first one
        secondFrame.scale.set(40, 40, 40); // Same scale as the first frame

        // Set the position of the second frame to the left of the first one
        secondFrame.position.set(362, 13, -225); // Adjust X to move it to the left

        // Rotate the second frame to face the camera
        secondFrame.rotation.y = -Math.PI / 2; // Rotate 90 degrees to face the camera

        // Add the second frame to the scene
        scene.add(secondFrame);

        // Create a plane for the new photo
        const newPhotoTexture = textureLoader.load(
            'static/models/Simon Models/frame/soapbox_blender.png', // Replace with the correct path
            () => console.log('New photo texture loaded successfully'),
            undefined,
            (error) => console.error('Error loading new photo texture:', error)
        );

        const newPhotoMaterial = new THREE.MeshBasicMaterial({ map: newPhotoTexture });
        const newPhoto = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.39), newPhotoMaterial);

        // Position the new photo inside the second frame
        newPhoto.position.set(0, 0, 0.01); // Adjust Z to place it slightly in front of the frame
        secondFrame.add(newPhoto); // Add the new photo as a child of the second frame
    },
    (progress) => {
        console.log('Loading second frame model progress:', progress);
    },
    (error) => {
        console.error('Error loading second frame model:', error);
    }
);

/** Unibank and Additional Frames Configuration */
const unibankFrameConfigs = [
    {
        position: { x: 171, y: 13, z: -420 }, // Position of the Unibank frame
        rotationY: -Math.PI / 10 - Math.PI / 45, // Slight counterclockwise rotation
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/unibank/Unibank Black.png' // Path to the Unibank logo
    },
    {
        position: { x: 211, y: 13, z: -404.6 }, // Position of the frame to the right
        rotationY: -Math.PI / 10 - Math.PI / 45, // Same rotation as the Unibank frame
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/unibank/Unistore.png' // Replace with the correct texture path
    },
    {
        position: { x: 131, y: 13, z: -435 }, // Position of the frame to the left
        rotationY: -Math.PI / 10 - Math.PI / 45, // Same rotation as the Unibank frame
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/unibank/Graphite_Drawn_Logo_Mockup.png' // Replace with the correct texture path
    }
];

// Load and configure frames dynamically
unibankFrameConfigs.forEach((config, index) => {
    gltfLoader.load(
        'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf', // Path to the frame model
        (gltf) => {
            console.log(`Frame ${index + 1} model loaded successfully`);

            // Access the frame model
            const frame = gltf.scene;

            // Set position
            frame.position.set(config.position.x, config.position.y, config.position.z);

            // Set rotation
            frame.rotation.y = config.rotationY;

            // Set scale
            frame.scale.set(config.scale.x, config.scale.y, config.scale.z);

            // Add the frame to the scene
            scene.add(frame);

            // Create a plane for the photo
            const photoTexture = textureLoader.load(
                config.texturePath, // Use the texture path from the configuration
                () => console.log(`Photo texture for frame ${index + 1} loaded successfully`),
                undefined,
                (error) => console.error(`Error loading photo texture for frame ${index + 1}:`, error)
            );

            const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
            const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.39), photoMaterial);

            // Position the photo inside the frame
            photo.position.set(0, 0, 0.01); // Slightly in front of the frame
            frame.add(photo); // Add the photo as a child of the frame
        },
        (progress) => {
            console.log(`Loading frame ${index + 1} model progress:`, progress);
        },
        (error) => {
            console.error(`Error loading frame ${index + 1} model:`, error);
        }
    );
});


/**Car Pics Exhibit */
// Define frame configurations
const frameConfigs = [
    //Back Wall
    {
        position: { x: -228, y: 11, z: -11 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Ferrari-2.jpg'
    },
    {
        position: { x: -228, y: 11, z: -25.875 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Ferrari.jpg'
    },
    {
        position: { x: -228, y: 11, z: -40.75 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Fiat.jpg'
    },
    {
        position: { x: -228, y: 11, z: -55.625 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Fiat_Yellow.jpg'
    },
    {
        position: { x: -228, y: 11, z: -70.5 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Oldporsche.jpg'
    },
    {
        position: { x: -228, y: 11, z: -85.375 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/McLarenOJ.jpg'
    },
    {
        position: { x: -228, y: 11, z: -100.25 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/McLarenTail.jpg'
    },
    {
        position: { x: -228, y: 11, z: -115.125 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/McLarenUTT.jpg'
    },

    //Left Wall
    {
        position: { x: -216, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/Old.jpg'
    },
    {
        position: { x: -201.125, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheBlack.jpg'
    },
    {
        position: { x: -186.25, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheBlack.jpg'
    },
    {
        position: { x: -171.375, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheFront.jpg'
    },
    {
        position: { x: -156.5, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheGrey.jpg'
    },
    {
        position: { x: -141.625, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheNeon.jpg'
    },
    {
        position: { x: -126.75, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/Rari.jpg'
    },
    //Right Wall
    {
        position: { x: -216, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/RariRain.jpg'
    },
    {
        position: { x: -201.125, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/RariSnow.jpg'
    },
    {
        position: { x: -186.25, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/RariTail.jpg'
    },
    {
        position: { x: -171.375, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/RariY.jpg'
    },
    {
        position: { x: -156.5, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/SkylineXKimlee.jpg'
    },
    {
        position: { x: -141.625, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/UnknownCar.jpg'
    },
    {
        position: { x: -126.75, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/Vette.jpg'
    },
];

// Load and configure frames
frameConfigs.forEach((config, index) => {
    gltfLoader.load(
        'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf', // Path to the frame model
        (gltf) => {
            console.log(`Frame ${index + 1} model loaded successfully`);

            // Access the frame model
            const frame = gltf.scene;

            // Set position
            frame.position.set(config.position.x, config.position.y, config.position.z);

            // Set rotation
            frame.rotation.y = config.rotationY;

            // Scale the frame
            frame.scale.set(22, 22, 22); // Adjust scale as necessary

            // Add the frame to the scene
            scene.add(frame);

            // Create a plane for the photo
            const photoGeometry = new THREE.PlaneGeometry(0.55, 0.39); // Adjust width and height to fit the frame
            const photoTexture = textureLoader.load(
                config.texturePath, // Use the texture path from the configuration
                () => console.log(`Photo texture for frame ${index + 1} loaded successfully`),
                undefined,
                (error) => console.error(`Error loading photo texture for frame ${index + 1}:`, error)
            );

            // Apply the texture to the photo material
            const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
            const photo = new THREE.Mesh(photoGeometry, photoMaterial);

            // Position the photo inside the frame
            photo.position.set(0, 0, 0.01); // Adjust Z to place it slightly in front of the frame
            frame.add(photo); // Add the photo as a child of the frame

            console.log(`Photo added to frame ${index + 1}`);
        },
        (progress) => {
            console.log(`Loading frame ${index + 1} model progress:`, progress);
        },
        (error) => {
            console.error(`Error loading frame ${index + 1} model:`, error);
        }
    );
});

/** Isometric Drawings*/
const isometricFrameConfigs = [
    {
        position: { x: 157, y: 13, z: 78 }, // Position of the first frame
        rotationY: Math.PI / 12 + Math.PI,
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/Isometric/Isometric Suburbs Night.png' // Path to the first isometric drawing
    },
    {
        position: { x: 103, y: 13, z: 45 }, // Position of the second frame
        rotationY: Math.PI / 6 + Math.PI / 4 + Math.PI / 12 + Math.PI / 18, // Rotate slightly to face the viewer
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/Isometric/Isometric Suburbs.png' // Path to the second isometric drawing
    },
    {
        position: {
            x: 191, y: 13
            , z: 24
        }, // Position of the third frame
        rotationY: Math.PI / 3 + Math.PI / 4 + Math.PI, // Rotate slightly to face the viewer
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/Isometric/Isometric Suburbs Night-01.png' // Path to the third isometric drawing
    }
];

// Load and configure frames dynamically
isometricFrameConfigs.forEach((config, index) => {
    gltfLoader.load(
        'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf', // Path to the frame model
        (gltf) => {
            console.log(`Isometric frame ${index + 1} model loaded successfully`);

            // Access the frame model
            const frame = gltf.scene;

            // Set position
            frame.position.set(config.position.x, config.position.y, config.position.z);

            // Set rotation
            frame.rotation.y = config.rotationY;

            // Set scale
            frame.scale.set(config.scale.x, config.scale.y, config.scale.z);

            // Add the frame to the scene
            scene.add(frame);

            // Create a plane for the isometric drawing
            const photoTexture = textureLoader.load(
                config.texturePath, // Use the texture path from the configuration
                () => console.log(`Isometric drawing texture for frame ${index + 1} loaded successfully`),
                undefined,
                (error) => console.error(`Error loading isometric drawing texture for frame ${index + 1}:`, error)
            );

            const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
            const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.39), photoMaterial);

            // Position the photo inside the frame
            photo.position.set(0, 0, 0.01); // Slightly in front of the frame
            frame.add(photo); // Add the photo as a child of the frame
        },
        (progress) => {
            console.log(`Loading isometric frame ${index + 1} model progress:`, progress);
        },
        (error) => {
            console.error(`Error loading isometric frame ${index + 1} model:`, error);
        }
    );
});

function movementUpdate() {
    controls.object.position.y = 10;
    //console.log("herereere")
    //console.log(collisionObjects.length)
    const time = performance.now();
    if (controls.isLocked === true) {

        raycaster.ray.origin.copy(controls.object.position);
        raycaster.ray.origin.y = 10;
        const intersections = raycaster.intersectObjects(collisionObjects, false);
        // console.log(intersections)

        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * speed * delta;
        velocity.z -= velocity.z * speed * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);

        direction.normalize(); // this ensures consistent movements in all directions

        //update velocity z
        if (moveForward || moveBackward) velocity.z -= direction.z * moveSpeed * delta;
        //update velocity x
        if (moveLeft || moveRight) velocity.x -= direction.x * moveSpeed * delta;

        //if(moveLeft) {otherDirection ="moveRight"}
        //if(moveRight) {otherDirection ="moveLeft"}
        // Raycasting for collision detection
        // raycaster.set(controls.object.position, direction);
        //  const intersections = raycaster.intersectObjects(collisionObjects, true);


        const onObject = intersections.length > 0;
        console.log(onObject)
        //check if left or right (where intersections occur)

        if (!onObject) {


            controls.moveForward(- velocity.z * delta);
            controls.moveRight(velocity.x * delta);

        }
        else if (intersections[0].distance > 5) {
            controls.moveForward(- velocity.z * delta);
            controls.moveRight(velocity.x * delta);

        }

        //have a case for each direction that we allow the opposite
        else if (intersections[0].distance < 5 && moveBackward === true) {
            console.log(intersections[0])
            console.log("stop")
            //allow to moveForward!
            //bounce away?

            controls.moveForward(velocity.z * .5);

            //let boxThatWasHit = intersections[0].object;
            //let hitPoint = intersections[0].point;

        }

        else if (intersections[0].distance < 5 && moveForward === true) {
            console.log(intersections[0])
            console.log("stop")
            //allow to moveForward!
            //bounce in opposite?
            controls.moveForward(velocity.z * .5);
        }

        else if (intersections[0].distance < 5 && moveRight === true) {
            console.log(intersections[0])
            console.log("stop")
            //allow to moveForward!
            //bounce away?
            controls.moveRight((-velocity.x * .5));
        }

        else if (intersections[0].distance < 5 && moveLeft === true) {
            console.log(intersections[0])
            console.log("stop")
            //allow to moveForward!
            //bounce away?
            controls.moveRight((-velocity.x * .5));
        }

    }
    prevTime = time;

}


// // Ensure each collision object has a bounding box
// collisionObjects.forEach(obj => {
//     obj.geometry.computeBoundingBox();
//     obj.boundingBox = obj.geometry.boundingBox.clone();
// });

// // Check for collisions in the animation loop
// function checkCollisions(camera) {
//     const playerBox = new THREE.Box3().setFromObject(camera);

//     for (const obj of collisionObjects) {
//         const objBox = new THREE.Box3().setFromObject(obj);
//         if (playerBox.intersectsBox(objBox)) {
//             console.log('Collision detected with:', obj.name);
//             return true; // Collision occurred
//         }
//     }
//     return false; // No collision
// }


// Background music
const audioListener = new THREE.AudioListener();
camera.add(audioListener);

const backgroundMusic = new THREE.Audio(audioListener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('static/Sound/Background.mp3', function (buffer) {
    backgroundMusic.setBuffer(buffer);
    backgroundMusic.setLoop(true);
    backgroundMusic.setVolume(.05); // Adjust volume as needed
});

// Start playback after user interaction
document.addEventListener('click', () => {
    if (!backgroundMusic.isPlaying) {
        backgroundMusic.play();
    }
});

// Footstep sound
const footstepSound = new THREE.Audio(audioListener);
audioLoader.load('static/Sound/Footsteps.mp3', function (buffer) {
    footstepSound.setBuffer(buffer);
    footstepSound.setLoop(true);
    footstepSound.setVolume(0.2); // Adjust volume as needed
});

function updateFootstepSound() {
    if (moveForward || moveBackward || moveLeft || moveRight) {
        if (!footstepSound.isPlaying) {
            footstepSound.play();
        }
    } else {
        if (footstepSound.isPlaying) {
            footstepSound.stop();
        }
    }
}


// Animation loop
function animate() {
    if (controls.isLocked === true) {
        movementUpdate();
        updateFootstepSound();
    }

    // Rotate the soap box if it exists
    if (soapBox) {
        soapBox.rotation.y += 0.05; // Rotate around the Y-axis
    }

    // checkCollisions(camera);

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}
animate();
