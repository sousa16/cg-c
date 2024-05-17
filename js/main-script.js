import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;
var geometry, material, mesh;
var objects = [];
var originalMaterials = [];

var directionalLight, ambientLight

var ToggleDirectionalLight = false;
var toggleBasic = false;

var BasicActive = false;
var GouraudActive = false;
var PhongActive = false;
var CartoonActive = false;
var NormalMapActive = false;

var clock = new THREE.Clock();

var materials = {
    'basic': new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    'phong': new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
    'gouraud': new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
    'cartoon': new THREE.MeshToonMaterial({ color: 0x00ff00 }),
    'normalMap': new THREE.MeshNormalMaterial(),
};

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    "use strict";
  
    scene = new THREE.Scene();
  }

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera() {
    "use strict";
  
    camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
  
    camera.position.set(0,6,9);
    camera.lookAt(0,5,0);
  }

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createDirectionalLight() {
    "use strict";
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    
    directionalLight.position.set(-20, 20, 20);
    directionalLight.target = scene; 
  
    scene.add(directionalLight);
}

function createAmbientLight() {
    "use strict";
    ambientLight = new THREE.AmbientLight(0xFFA500, 0.2);
    ambientLight.position.set(-10, 22, 0);
  
    scene.add(ambientLight);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createObjects() {
    createDirectionalLight();
    createAmbientLight();

    // Create a cube and add it to the scene
    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = materials['phong']
    mesh = new THREE.Mesh(geometry, material);
    objects.push(mesh);
    scene.add(mesh);

    // Create a cylinder and add it to the scene
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    material = materials['lambert']
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(5, 0, 0);
    objects.push(mesh);
    scene.add(mesh);

    // Create a sphere and add it to the scene
    geometry = new THREE.SphereGeometry(1, 32, 32);
    material = materials['cartoon']
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(2, 0, 0);
    objects.push(mesh);
    scene.add(mesh);

    // Create a torus and add it to the scene
    geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    material = materials['normalMap']
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-2, 0, 0);
    objects.push(mesh);
    scene.add(mesh);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

    if (ToggleDirectionalLight){
        directionalLight.visible = !directionalLight.visible;
        ToggleDirectionalLight = false;
    }

    if (GouraudActive){
        for (var i = 0; i < objects.length; i++) {
            objects[i].material = materials["gouraud"];
        }
        GouraudActive = false;
    }

    if (PhongActive){
        for (var i = 0; i < objects.length; i++) {
            objects[i].material = materials["phong"];
        }
        PhongActive = false;
    }

    if (CartoonActive){
        for (var i = 0; i < objects.length; i++) {
            objects[i].material = materials["cartoon"];
        }
        CartoonActive = false;
    }

    if (NormalMapActive){
        for (var i = 0; i < objects.length; i++) {
            objects[i].material = materials["normalMap"];
        }
        NormalMapActive = false;
    }

    if (toggleBasic) {
        if (BasicActive) {
            for (var i = 0; i < objects.length; i++) {
                objects[i].material = originalMaterials[i];
            }
            BasicActive = false;
        }

        else {
            for (var i = 0; i < objects.length; i++) {
                originalMaterials[i] = objects[i].material;
                objects[i].material = materials["basic"];
            }
            BasicActive = true;
        }

        toggleBasic = false;
    }


}

/////////////
/* DISPLAY */
/////////////
function render() {
    "use strict";
    renderer.render(scene, camera);
  }

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    document.body.appendChild(VRButton.createButton(renderer));
    renderer.xr.enabled = true;

    createScene();
    createCamera();

    createObjects();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';


    update();
    render();

    renderer.setAnimationLoop( function () {

        renderer.render( scene, camera );
    
    } );

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 68: case 100: ToggleDirectionalLight = true; break; // D/d

        case 81: GouraudActive = true; break; // Q/q
        case 87: PhongActive = true; break;   // W/w
        case 69: CartoonActive = true; break; // E/e
        case 82: NormalMapActive = true; break; // R/r
        
        case 84: toggleBasic = true; break; // T/t
    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
}

init();
animate();