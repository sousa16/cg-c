import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer, aspectRatio, clock;
var activeCamera, frontCamera, sideCamera, topCamera, orthographicCamera, perspectiveCamera, mobileCamera;

var materials;

var carousel, ring1, ring2, ring3;

var cylBaseGeometry, cylBaseMesh;
var ring1UpGeometry, ring1UpMesh, ring1DownGeometry, ring1DownMesh, cyl1InGeometry, cyl1InMesh, cyl1OutGeometry, cyl1OutMesh;
var ring2UpGeometry, ring2UpMesh, ring2DownGeometry, ring2DownMesh, cyl2InGeometry, cyl2InMesh, cyl2OutGeometry, cyl2OutMesh;
var ring3UpGeometry, ring3UpMesh, ring3DownGeometry, ring3DownMesh, cyl3InGeometry, cyl3InMesh, cyl3OutGeometry, cyl3OutMesh;


var materials = {
    "dark grey": new THREE.MeshBasicMaterial({ color: 0x444745, wireframe: true }),
    "white": new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
    "yellow": new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true }),
    "red": new THREE.MeshBasicMaterial({ color: 0xd71b12, wireframe: true }),
    "pink": new THREE.MeshBasicMaterial({ color: 0xf757d7, wireframe: true }),
    "blue": new THREE.MeshBasicMaterial({ color: 0x0b0fd3, wireframe: true }),
    "orange": new THREE.MeshBasicMaterial({ color: 0xeb6900, wireframe: true }),
    "purple": new THREE.MeshBasicMaterial({ color: 0x9000eb, wireframe: true }),
    "dark green": new THREE.MeshBasicMaterial({ color: 0x257203, wireframe: true }),
    "dark green 1": new THREE.MeshBasicMaterial({ color: 0x206a00, wireframe: true }),
    "dark green 2": new THREE.MeshBasicMaterial({ color: 0x00450e, wireframe: true }),
    "transparent": new THREE.MeshBasicMaterial({ color: 0x87CEFA, opacity: 0.1, transparent: true }),
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(20));

	createCarousel(0, 0, 0);

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

/*ISTO É SÓ PARA DEBUG, DEPOIS TEMOS DE MUDAR ESTAS CAMARAS*/
function createCamera() {
    'use strict';

    aspectRatio = window.innerWidth / window.innerHeight;

    // Frontal camera
    frontCamera = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
    frontCamera.position.z = 200;

    // Side camera
    sideCamera = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
    sideCamera.position.x = 200;

    // Top camera
    topCamera = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
    topCamera.position.y = 200;

    // Orthographic camera
    orthographicCamera = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
    orthographicCamera.position.set(100, 100, 100); // Position it off the main axes

    // Perspective camera
    perspectiveCamera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    perspectiveCamera.position.set(100, 100, 100); // Position it off the main axes


    activeCamera = frontCamera;

    // Make sure they're pointing towards the scene
    frontCamera.lookAt(scene.position);
    sideCamera.lookAt(scene.position);
    topCamera.lookAt(scene.position);
    orthographicCamera.lookAt(scene.position);
    perspectiveCamera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createCarousel(x, y, z){
    'use strict';
	carousel = new THREE.Object3D();

	createCylBase(carousel, x, y + 30, z);
	createRing1(carousel, x, y + 5 , z);
	createRing2(carousel, x, y + 5 , z);
	createRing3(carousel, x, y + 5 , z);

    scene.add(carousel);

    carousel.position.x = x;
    carousel.position.y = y;
    carousel.position.z = z;
}

function createCylBase(obj, x , y, z){
    'use strict';

	cylBaseGeometry = new THREE.CylinderGeometry( 10, 10, 60, 30);
	cylBaseMesh = new THREE.Mesh(cylBaseGeometry, materials["purple"]);

    cylBaseMesh.position.set(x, y, z);

    obj.add(cylBaseMesh);

}

function createRing1(obj, x , y, z){
	'use strict';
	ring1 = new THREE.Object3D();


	ring1UpGeometry = new THREE.RingGeometry(10, 20, 30);
	ring1UpMesh = new THREE.Mesh(ring1UpGeometry, materials["blue"]);
	ring1UpMesh.rotation.x = Math.PI / 2;
	ring1UpMesh.position.set(x, y, z);

	cyl1InGeometry = new THREE.CylinderGeometry( 10, 10, 10, 30, 1, true);
	cyl1InMesh = new THREE.Mesh(cyl1InGeometry, materials["blue"]);
	cyl1InMesh.position.set(x, y - 5, z);

	cyl1OutGeometry = new THREE.CylinderGeometry( 20, 20, 10, 30, 1, true);
	cyl1OutMesh = new THREE.Mesh(cyl1OutGeometry, materials["blue"]);
	cyl1OutMesh.position.set(x, y - 5, z);

	ring1DownGeometry = new THREE.RingGeometry(10, 20, 30);
	ring1DownMesh = new THREE.Mesh(ring1DownGeometry, materials["blue"]);
	ring1DownMesh.rotation.x = Math.PI / 2;
	ring1DownMesh.position.set(x, y - 10, z);

	ring1.add(ring1UpMesh);
	ring1.add(cyl1InMesh);
	ring1.add(cyl1OutMesh);
	ring1.add(ring1DownMesh);

	ring1.position.set(0, 45, 0);

	obj.add(ring1);

}

function createRing2(obj, x , y, z){
	'use strict';
	ring2 = new THREE.Object3D();


	ring2UpGeometry = new THREE.RingGeometry(20, 30, 30);
	ring2UpMesh = new THREE.Mesh(ring2UpGeometry, materials["dark green"]);
	ring2UpMesh.rotation.x = Math.PI / 2;
	ring2UpMesh.position.set(x, y, z);

	cyl2InGeometry = new THREE.CylinderGeometry( 20, 20, 10, 30, 1, true);
	cyl2InMesh = new THREE.Mesh(cyl2InGeometry, materials["dark green"]);
	cyl2InMesh.position.set(x, y - 5, z);

	cyl2OutGeometry = new THREE.CylinderGeometry( 30, 30, 10, 30, 1, true);
	cyl2OutMesh = new THREE.Mesh(cyl2OutGeometry, materials["dark green"]);
	cyl2OutMesh.position.set(x, y - 5, z);

	ring2DownGeometry = new THREE.RingGeometry(20, 30, 30);
	ring2DownMesh = new THREE.Mesh(ring2DownGeometry, materials["dark green"]);
	ring2DownMesh.rotation.x = Math.PI / 2;
	ring2DownMesh.position.set(x, y - 10, z);

	ring2.add(ring2UpMesh);
	ring2.add(cyl2InMesh);
	ring2.add(cyl2OutMesh);
	ring2.add(ring2DownMesh);

	ring2.position.set(0, 35, 0);

	obj.add(ring2);

}

function createRing3(obj, x , y, z){
	'use strict';
	ring3 = new THREE.Object3D();


	ring3UpGeometry = new THREE.RingGeometry(30, 40, 30);
	ring3UpMesh = new THREE.Mesh(ring3UpGeometry, materials["red"]);
	ring3UpMesh.rotation.x = Math.PI / 2;
	ring3UpMesh.position.set(x, y, z);

	cyl3InGeometry = new THREE.CylinderGeometry( 30, 30, 10, 30, 1, true);
	cyl3InMesh = new THREE.Mesh(cyl3InGeometry, materials["red"]);
	cyl3InMesh.position.set(x, y - 5, z);

	cyl3OutGeometry = new THREE.CylinderGeometry( 40, 40, 10, 30, 1, true);
	cyl3OutMesh = new THREE.Mesh(cyl3OutGeometry, materials["red"]);
	cyl3OutMesh.position.set(x, y - 5, z);

	ring3DownGeometry = new THREE.RingGeometry(30, 40, 30);
	ring3DownMesh = new THREE.Mesh(ring3DownGeometry, materials["red"]);
	ring3DownMesh.rotation.x = Math.PI / 2;
	ring3DownMesh.position.set(x, y - 10, z);

	ring3.add(ring3UpMesh);
	ring3.add(cyl3InMesh);
	ring3.add(cyl3OutMesh);
	ring3.add(ring3DownMesh);

	ring3.position.set(0, 25, 0);

	obj.add(ring3);

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
	//carousel.rotation.y += 0.01;
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
	renderer.render(scene, activeCamera);

}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0xd3d3d3); // light gray color
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();


    render();

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    requestAnimationFrame(animate);

    update();

    render();
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
        case 49: //1
            activeCamera = frontCamera;
            prevKey = activeKey;
            activeKey = 1;
            break;
        case 50: //2
            activeCamera = sideCamera;
            prevKey = activeKey;
            activeKey = 2;
            break;
        case 51: //3
            activeCamera = topCamera;
            prevKey = activeKey;
            activeKey = 3;
            break;
        case 52: //4
            activeCamera = orthographicCamera;
            prevKey = activeKey;
            activeKey = 4;
            break;
        case 53: //5
            activeCamera = perspectiveCamera;
            prevKey = activeKey;
            activeKey = 5;
            break;

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
