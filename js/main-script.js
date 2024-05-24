import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;
var geometry, material, mesh;
var objects = [];
var originalMaterials = [];
var basicMaterials = {}, cartoonMaterials = {}, gouraudMaterials = {}, phongMaterials = {};

var directionalLight, ambientLight

var ToggleDirectionalLight = false;
var toggleBasic = false;

var BasicActive = false;
var GouraudActive = false;
var PhongActive = false;
var CartoonActive = false;
var NormalMapActive = false;

var carousel, ring1, ring2, ring3;

var cylBaseGeometry, cylBaseMesh;
var ring1UpGeometry, ring1UpMesh, ring1DownGeometry, ring1DownMesh, ring1HeightGeometry, ring1HeightMesh;
var ring2UpGeometry, ring2UpMesh, ring2DownGeometry, ring2DownMesh, ring2HeightGeometry, ring2HeightMesh;
var ring3UpGeometry, ring3UpMesh, ring3DownGeometry, ring3DownMesh, ring3HeightGeometry, ring3HeightMesh;

var parametricMeshes = [];
var par1R1Geometry, par1R1Mesh, par2R1Geometry, par2R1Mesh, par3R1Geometry, par3R1Mesh, par4R1Geometry, par4R1Mesh, par5R1Geometry, par5R1Mesh, par6R1Geometry, par6R1Mesh, par7R1Geometry, par7R1Mesh, par8R1Geometry, par8R1Mesh;
var par1R2Geometry, par1R2Mesh, par2R2Geometry, par2R2Mesh, par3R2Geometry, par3R2Mesh, par4R2Geometry, par4R2Mesh, par5R2Geometry, par5R2Mesh, par6R2Geometry, par6R2Mesh, par7R2Geometry, par7R2Mesh, par8R2Geometry, par8R2Mesh;
var par1R3Geometry, par1R3Mesh, par2R3Geometry, par2R3Mesh, par3R3Geometry, par3R3Mesh, par4R3Geometry, par4R3Mesh, par5R3Geometry, par5R3Mesh, par6R3Geometry, par6R3Mesh, par7R3Geometry, par7R3Mesh, par8R3Geometry, par8R3Mesh;

var mobiusGeometry, mobiusMesh;
var skydomeGeometry, skydomeMesh, skydomeMaterial;

var parametricRotations = [];
var parametricSpotlights = [];

var direction1 = 1;
var direction2 = 1;
var direction3 = 1;

var key1 = true;
var key2 = true;
var key3 = true;
var spotlights = true;

var clock = new THREE.Clock();

var colors = {
	"dark grey": 0x444745,
	"white": 0xffffff,
	"yellow": 0xffd700,
	"red": 0xd71b12,
	"pink": 0xf757d7,
	"blue": 0x0b0fd3,
	"orange": 0xeb6900,
	"purple": 0x9000eb,
	"dark green": 0x257203,
	"light blue": 0x87CEFA,
	"brown": 0x8B4513,
	"black": 0x000000,
	"green": 0x008000,
	"light green": 0x90EE90,
	"dark blue": 0x00008B,
	"light yellow": 0xFFFFE0,
	"dark red": 0x8B0000
};

for (var colorName in colors) {
	var color = colors[colorName];
	basicMaterials[colorName] = new THREE.MeshBasicMaterial({ color: color });
	cartoonMaterials[colorName] = new THREE.MeshToonMaterial({ color: color });
	gouraudMaterials[colorName] = new THREE.MeshLambertMaterial({ color: color });
	phongMaterials[colorName] = new THREE.MeshPhongMaterial({ color: color });
}

var materials = {
	'normalMap': new THREE.MeshNormalMaterial(),
};

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
	'use strict';

	scene = new THREE.Scene();
	scene.add(new THREE.AxesHelper(10));

	createCarousel(0, 0, 0);
	createSkydome();
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

	camera.position.set(0, 60, 90);
	camera.lookAt(0, 5, 0);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createDirectionalLight() {
	"use strict";
	directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

	directionalLight.position.set(-20, 20, 20);
	directionalLight.target = scene;

	scene.add(directionalLight);
}

function createAmbientLight() {
	"use strict";
	ambientLight = new THREE.AmbientLight(0xFFA500, 0.1);
	ambientLight.position.set(-10, 55, 0);

	scene.add(ambientLight);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createObjects() {
	createDirectionalLight();
	createAmbientLight();
}

function createSkydome() {
	'use strict';
	skydomeGeometry = new THREE.SphereGeometry(100, 124, 32, 0, Math.PI * 2, 0, 1.75);
	let map = new THREE.TextureLoader().load("./textures/skydome1.png");
	skydomeMaterial = new THREE.MeshPhongMaterial({ map: map, side: THREE.DoubleSide })
	skydomeMesh = new THREE.Mesh(skydomeGeometry, skydomeMaterial);
	skydomeMesh.position.set(0, 40, 0);
	scene.add(skydomeMesh);
}
function createCarousel(x, y, z) {
	'use strict';
	carousel = new THREE.Object3D();

	createCylBase(carousel, x, y + 30, z);
	createRing1(carousel, x, y + 5, z);
	createRing2(carousel, x, y + 5, z);
	createRing3(carousel, x, y + 5, z);
	createMobiusStrip(carousel, x, y + 70, z);

	carousel.position.x = x;
	carousel.position.y = y;
	carousel.position.z = z;

	scene.add(carousel);

}

function createCylBase(obj, x, y, z) {
	'use strict';

	cylBaseGeometry = new THREE.CylinderGeometry(10, 10, 60, 30);
	cylBaseMesh = new THREE.Mesh(cylBaseGeometry, gouraudMaterials["dark grey"]);

	cylBaseMesh.position.set(x, y, z);

	obj.add(cylBaseMesh);
	objects.push(cylBaseMesh);

}

function createRing1(obj, x, y, z) {
	'use strict';
	ring1 = new THREE.Object3D();

	var ringShape = new THREE.Shape();
	ringShape.moveTo(10, 0);
	ringShape.absarc(0, 0, 10, 0, Math.PI * 2, false);
	ringShape.moveTo(20, 0);
	ringShape.absarc(0, 0, 20, 0, Math.PI * 2, true);


	var extrudeSettings = {
		steps: 10,
		depth: 10, //height of ring
		bevelEnabled: false,
	};

	ring1HeightGeometry = new THREE.ExtrudeGeometry(ringShape, extrudeSettings);
	ring1HeightMesh = new THREE.Mesh(ring1HeightGeometry, cartoonMaterials["blue"]);
	ring1HeightMesh.rotation.x = Math.PI / 2;
	ring1HeightMesh.position.set(x, y, z);

	ring1UpGeometry = new THREE.RingGeometry(10, 20, 30);
	ring1UpMesh = new THREE.Mesh(ring1UpGeometry, cartoonMaterials["blue"]);
	ring1UpMesh.rotation.x = Math.PI / 2;
	ring1UpMesh.position.set(x, y, z);

	ring1DownGeometry = new THREE.RingGeometry(10, 20, 30);
	ring1DownMesh = new THREE.Mesh(ring1DownGeometry, cartoonMaterials["blue"]);
	ring1DownMesh.rotation.x = Math.PI / 2;
	ring1DownMesh.position.set(x, y - 10, z);

	ring1.add(ring1HeightMesh);
	ring1.add(ring1UpMesh);
	ring1.add(ring1DownMesh);

	objects.push(ring1HeightMesh);
	objects.push(ring1UpMesh);
	objects.push(ring1DownMesh);

	ring1.position.set(0, 45, 0);

	y += 2.5;
	createParametric1(ring1, x, y, z);
	createParametric2(ring1, x, y, z);
	createParametric3(ring1, x, y, z);
	createParametric4(ring1, x, y, z);
	createParametric5(ring1, x, y, z);
	createParametric6(ring1, x, y, z);
	createParametric7(ring1, x, y, z);
	createParametric8(ring1, x, y, z);


	obj.add(ring1);
}

function createRing2(obj, x, y, z) {
	'use strict';
	ring2 = new THREE.Object3D();

	var ringShape = new THREE.Shape();
	ringShape.moveTo(20, 0);
	ringShape.absarc(0, 0, 20, 0, Math.PI * 2, false);
	ringShape.moveTo(30, 0);
	ringShape.absarc(0, 0, 30, 0, Math.PI * 2, true);


	var extrudeSettings = {
		steps: 10,
		depth: 10, //height of ring
		bevelEnabled: false,
	};

	ring2HeightGeometry = new THREE.ExtrudeGeometry(ringShape, extrudeSettings);
	ring2HeightMesh = new THREE.Mesh(ring2HeightGeometry, phongMaterials["dark green"]);
	ring2HeightMesh.rotation.x = Math.PI / 2;
	ring2HeightMesh.position.set(x, y, z);

	ring2UpGeometry = new THREE.RingGeometry(20, 30, 30);
	ring2UpMesh = new THREE.Mesh(ring2UpGeometry, phongMaterials["dark green"]);
	ring2UpMesh.rotation.x = Math.PI / 2;
	ring2UpMesh.position.set(x, y, z);

	ring2DownGeometry = new THREE.RingGeometry(20, 30, 30);
	ring2DownMesh = new THREE.Mesh(ring2DownGeometry, phongMaterials["dark green"]);
	ring2DownMesh.rotation.x = Math.PI / 2;
	ring2DownMesh.position.set(x, y - 10, z);

	ring2.add(ring2HeightMesh);
	ring2.add(ring2UpMesh);
	ring2.add(ring2DownMesh);

	objects.push(ring2HeightMesh);
	objects.push(ring2UpMesh);
	objects.push(ring2DownMesh);

	ring2.position.set(0, 35, 0);

	y += 2.5;
	createParametric1(ring2, x + 10, y, z);
	createParametric2(ring2, x + 7, y, z - 7);
	createParametric3(ring2, x, y, z - 10);
	createParametric4(ring2, x - 7, y, z - 7);
	createParametric5(ring2, x - 10, y, z);
	createParametric6(ring2, x - 7, y, z + 7);
	createParametric7(ring2, x, y, z + 10);
	createParametric8(ring2, x + 7, y, z + 7);

	obj.add(ring2);
}

function createRing3(obj, x, y, z) {
	'use strict';
	ring3 = new THREE.Object3D();

	var ringShape = new THREE.Shape();
	ringShape.moveTo(30, 0);
	ringShape.absarc(0, 0, 30, 0, Math.PI * 2, false);
	ringShape.moveTo(40, 0);
	ringShape.absarc(0, 0, 40, 0, Math.PI * 2, true);


	var extrudeSettings = {
		steps: 10,
		depth: 10, //height of ring
		bevelEnabled: false,
	};

	ring3HeightGeometry = new THREE.ExtrudeGeometry(ringShape, extrudeSettings);
	ring3HeightMesh = new THREE.Mesh(ring3HeightGeometry, basicMaterials["red"]);
	ring3HeightMesh.rotation.x = Math.PI / 2;
	ring3HeightMesh.position.set(x, y, z);

	ring3UpGeometry = new THREE.RingGeometry(30, 40, 30);
	ring3UpMesh = new THREE.Mesh(ring3UpGeometry, basicMaterials["red"]);
	ring3UpMesh.rotation.x = Math.PI / 2;
	ring3UpMesh.position.set(x, y, z);

	ring3DownGeometry = new THREE.RingGeometry(30, 40, 30);
	ring3DownMesh = new THREE.Mesh(ring3DownGeometry, basicMaterials["red"]);
	ring3DownMesh.rotation.x = Math.PI / 2;
	ring3DownMesh.position.set(x, y - 10, z);

	ring3.add(ring3HeightMesh);
	ring3.add(ring3UpMesh);
	ring3.add(ring3DownMesh);

	objects.push(ring3HeightMesh);
	objects.push(ring3UpMesh);
	objects.push(ring3DownMesh);

	ring3.position.set(0, 25, 0);

	y += 2.5;
	createParametric1(ring3, x + 20, y, z);
	createParametric2(ring3, x + 14, y, z - 14);
	createParametric3(ring3, x, y, z - 20);
	createParametric4(ring3, x - 14, y, z - 14);
	createParametric5(ring3, x - 20, y, z);
	createParametric6(ring3, x - 14, y, z + 14);
	createParametric7(ring3, x, y, z + 20);
	createParametric8(ring3, x + 14, y, z + 14);

	obj.add(ring3);
}

///////////////////////////////
/* CREATE PARAMETRIC OBJECTS */
///////////////////////////////

function createParametric1(obj, x, y, z) {
	'use strict';

	function customFunction(u, v, vector) {
		var x = u * Math.PI;
		var y = v * Math.PI;
		var z = Math.sin(u * Math.PI) * Math.cos(v * Math.PI) * 1.5;
		vector.set(x - 1.5, y, z);
	}

	var spotlight = new THREE.SpotLight(0xffffff, 1);

	if (obj == ring1) {
		par1R1Geometry = new ParametricGeometry(customFunction, 25, 25);
		par1R1Mesh = new THREE.Mesh(par1R1Geometry, basicMaterials["yellow"]);
		par1R1Mesh.position.set(x + 15, y, z);

		obj.add(par1R1Mesh);
		objects.push(par1R1Mesh);
		parametricMeshes.push(par1R1Mesh);

	}
	if (obj == ring2) {
		par1R2Geometry = new ParametricGeometry(customFunction, 25, 25);
		par1R2Mesh = new THREE.Mesh(par1R2Geometry, basicMaterials["orange"]);
		par1R2Mesh.position.set(x + 15, y, z);

		obj.add(par1R2Mesh);
		objects.push(par1R2Mesh);
		parametricMeshes.push(par1R2Mesh);
	}
	if (obj == ring3) {
		par1R3Geometry = new ParametricGeometry(customFunction, 25, 25);
		par1R3Mesh = new THREE.Mesh(par1R3Geometry, basicMaterials["dark green"]);
		par1R3Mesh.position.set(x + 15, y, z);

		obj.add(par1R3Mesh);
		objects.push(par1R3Mesh);
		parametricMeshes.push(par1R3Mesh);
	}

	spotlight.position.set(x + 15, y + 5, z);
	spotlight.target = par1R1Mesh;
	obj.add(spotlight);
	console.log(spotlight);
	parametricSpotlights.push(spotlight);
}

function createParametric2(obj, x, y, z) {
	'use strict';

	function functionKlein(u, v, vector) {
		const scale = 0.5;

		u *= Math.PI;
		v *= 2 * Math.PI;
		u = u * 2;

		let x, y, z;
		if (u < Math.PI) {
			x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
			z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
		} else {
			x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
			z = -8 * Math.sin(u);
		}
		y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

		x *= scale;
		y *= scale;
		z *= scale;
		vector.set(x - 0.4, y, z + 0.4);
	}
	if (obj == ring1) {
		par2R1Geometry = new ParametricGeometry(functionKlein, 30, 30);
		par2R1Mesh = new THREE.Mesh(par2R1Geometry, phongMaterials["light blue"]);
		par2R1Mesh.position.set(x + 11, y + 1.5, z - 11);

		obj.add(par2R1Mesh);
		objects.push(par2R1Mesh);
		parametricMeshes.push(par2R1Mesh);
	}
	if (obj == ring2) {
		par2R2Geometry = new ParametricGeometry(functionKlein, 30, 30);
		par2R2Mesh = new THREE.Mesh(par2R2Geometry, phongMaterials["orange"]);
		par2R2Mesh.position.set(x + 11, y + 1.5, z - 11);

		obj.add(par2R2Mesh);
		objects.push(par2R2Mesh);
		parametricMeshes.push(par2R2Mesh);
	}
	if (obj == ring3) {
		par2R3Geometry = new ParametricGeometry(functionKlein, 30, 30);
		par2R3Mesh = new THREE.Mesh(par2R3Geometry, phongMaterials["dark green"]);
		par2R3Mesh.position.set(x + 11, y + 1.5, z - 11);

		obj.add(par2R3Mesh);
		objects.push(par2R3Mesh);
		parametricMeshes.push(par2R3Mesh);
	}
}

function createParametric3(obj, x, y, z) {
	'use strict';

	function functionP(u, v, vector) {
		var radius = 2;
		var height = 4;

		var xpos, ypos, zpos;

		if (v < 0.05) { // Cylinder base
			var r = radius * (v / 0.05);
			xpos = r * Math.cos(u * 2 * Math.PI);
			ypos = -height / 2;
			zpos = r * Math.sin(u * 2 * Math.PI);
		} else if (v > 0.95) { // Cylinder top
			var r = radius * ((1 - v) / 0.05);
			xpos = r * Math.cos(u * 2 * Math.PI);
			ypos = height / 2;
			zpos = r * Math.sin(u * 2 * Math.PI);
		} else { // Cylinder boddy
			var theta = u * 2 * Math.PI;
			xpos = radius * Math.cos(theta);
			ypos = v * height - height / 2;
			zpos = radius * Math.sin(theta);
		}

		// Cylinder rotation
		var angle = Math.PI / 6;
		var cosAngle = Math.cos(angle);
		var sinAngle = Math.sin(angle);

		var xRot = xpos * cosAngle - ypos * sinAngle;
		var yRot = xpos * sinAngle + ypos * cosAngle;

		vector.set(xRot, yRot + 3, zpos);
	}
	if (obj == ring1) {
		par3R1Geometry = new ParametricGeometry(functionP, 30, 30);
		par3R1Mesh = new THREE.Mesh(par3R1Geometry, gouraudMaterials["dark blue"]);
		par3R1Mesh.position.set(x, y, z - 15);

		obj.add(par3R1Mesh);
		objects.push(par3R1Mesh);
		parametricMeshes.push(par3R1Mesh);
	}
	if (obj == ring2) {
		par3R2Geometry = new ParametricGeometry(functionP, 30, 30);
		par3R2Mesh = new THREE.Mesh(par3R2Geometry, gouraudMaterials["purple"]);
		par3R2Mesh.position.set(x, y, z - 15);

		obj.add(par3R2Mesh);
		objects.push(par3R2Mesh);
		parametricMeshes.push(par3R2Mesh);
	}
	if (obj == ring3) {
		par3R3Geometry = new ParametricGeometry(functionP, 30, 30);
		par3R3Mesh = new THREE.Mesh(par3R3Geometry, gouraudMaterials["red"]);
		par3R3Mesh.position.set(x, y, z - 15);

		obj.add(par3R3Mesh);
		objects.push(par3R3Mesh);
		parametricMeshes.push(par3R3Mesh);
	}
}

function createParametric4(obj, x, y, z) {
	'use strict';

	function functionP(u, v, vector) {
		var radius = 3;
		var height = 5;

		var xpos, ypos, zpos;

		if (v < 0.05) { // cone base
			var r = radius * (v / 0.05);
			xpos = r * Math.cos(u * 2 * Math.PI);
			ypos = -height / 2;
			zpos = r * Math.sin(u * 2 * Math.PI);
		} else { // cone boddy
			var theta = u * 2 * Math.PI;
			var r = (1 - v) * radius;
			xpos = r * Math.cos(theta);
			ypos = v * height - height / 2;
			zpos = r * Math.sin(theta);
		}

		// cone rotation
		var angle = Math.PI / 12;
		var cosAngle = Math.cos(angle);
		var sinAngle = Math.sin(angle);
		var xRot = xpos * cosAngle - ypos * sinAngle;
		var yRot = xpos * sinAngle + ypos * cosAngle;

		vector.set(xRot, yRot, zpos);
	}
	if (obj == ring1) {
		par4R1Geometry = new ParametricGeometry(functionP, 32, 32);
		par4R1Mesh = new THREE.Mesh(par4R1Geometry, materials["normalMap"]);
		par4R1Mesh.position.set(x - 11, y + 3.2, z - 11);

		obj.add(par4R1Mesh);
		objects.push(par4R1Mesh);
		parametricMeshes.push(par4R1Mesh);
	}
	if (obj == ring2) {
		par4R2Geometry = new ParametricGeometry(functionP, 32, 32);
		par4R2Mesh = new THREE.Mesh(par4R2Geometry, materials["normalMap"]);
		par4R2Mesh.position.set(x - 11, y + 3.2, z - 11);

		obj.add(par4R2Mesh);
		objects.push(par4R2Mesh);
		parametricMeshes.push(par4R2Mesh);
	}
	if (obj == ring3) {
		par4R3Geometry = new ParametricGeometry(functionP, 32, 32);
		par4R3Mesh = new THREE.Mesh(par4R3Geometry, materials["normalMap"]);
		par4R3Mesh.position.set(x - 11, y + 3.2, z - 11);

		obj.add(par4R3Mesh);
		objects.push(par4R3Mesh);
		parametricMeshes.push(par4R3Mesh);
	}
}

function createParametric5(obj, x, y, z) {
	'use strict';

	function functionP(u, v, vector) {
		var baseRadius = 2;
		var topRadius = 1;
		var height = 4;

		var xpos, ypos, zpos;

		if (v < 0.05) { // base
			var r = baseRadius * v;
			xpos = r * Math.cos(u * 2 * Math.PI);
			ypos = -height / 2;
			zpos = r * Math.sin(u * 2 * Math.PI);
		} else if (v > 0.95) { // top
			var r = topRadius * ((1 - v) / 0.05);
			xpos = r * Math.cos(u * 2 * Math.PI);
			ypos = height / 2;
			zpos = r * Math.sin(u * 2 * Math.PI);
		} else { // boddy
			var blendRadius = baseRadius - (baseRadius - topRadius) * (v - 0.05) / 0.9;
			xpos = blendRadius * Math.cos(u * 2 * Math.PI);
			ypos = v * height - height / 2;
			zpos = blendRadius * Math.sin(u * 2 * Math.PI);
		}

		vector.set(xpos, ypos, zpos);
	}
	if (obj == ring1) {
		par5R1Geometry = new ParametricGeometry(functionP, 25, 25);
		par5R1Mesh = new THREE.Mesh(par5R1Geometry, cartoonMaterials["orange"]);
		par5R1Mesh.position.set(x - 15, y + 2, z);

		obj.add(par5R1Mesh);
		objects.push(par5R1Mesh);
		parametricMeshes.push(par5R1Mesh);
	}
	if (obj == ring2) {
		par5R2Geometry = new ParametricGeometry(functionP, 32, 32);
		par5R2Mesh = new THREE.Mesh(par5R2Geometry, cartoonMaterials["black"]);
		par5R2Mesh.position.set(x - 15, y + 2, z);

		obj.add(par5R2Mesh);
		objects.push(par5R2Mesh);
		parametricMeshes.push(par5R2Mesh);
	}
	if (obj == ring3) {
		par5R3Geometry = new ParametricGeometry(functionP, 32, 32);
		par5R3Mesh = new THREE.Mesh(par5R3Geometry, cartoonMaterials["purple"]);
		par5R3Mesh.position.set(x - 15, y + 2, z);

		obj.add(par5R3Mesh);
		objects.push(par5R3Mesh);
		parametricMeshes.push(par5R3Mesh);
	}
}

function createParametric6(obj, x, y, z) {
	'use strict';

	function functionP(u, v, vector) {
		var radius = 2;
		var tubeRadius = 0.5;

		var phi = u * Math.PI * 2;
		var theta = v * Math.PI * 2;

		var xCoord = (radius + tubeRadius * Math.cos(theta)) * Math.cos(phi);
		var yCoord = (radius + tubeRadius * Math.cos(theta)) * Math.sin(phi);
		var zCoord = tubeRadius * Math.sin(theta);

		vector.set(xCoord, yCoord, zCoord);

	}
	if (obj == ring1) {
		par6R1Geometry = new ParametricGeometry(functionP, 32, 32);
		par6R1Mesh = new THREE.Mesh(par6R1Geometry, materials["normalMap"]);
		par6R1Mesh.position.set(x - 11, y + 2.5, z + 11);

		obj.add(par6R1Mesh);
		objects.push(par6R1Mesh);
		parametricMeshes.push(par6R1Mesh);
	}
	if (obj == ring2) {
		par6R2Geometry = new ParametricGeometry(functionP, 32, 32);
		par6R2Mesh = new THREE.Mesh(par6R2Geometry, materials["normalMap"]);
		par6R2Mesh.position.set(x - 11, y + 2.5, z + 11);

		obj.add(par6R2Mesh);
		objects.push(par6R2Mesh);
		parametricMeshes.push(par6R2Mesh);
	}
	if (obj == ring3) {
		par6R3Geometry = new ParametricGeometry(functionP, 32, 32);
		par6R3Mesh = new THREE.Mesh(par6R3Geometry, materials["normalMap"]);
		par6R3Mesh.position.set(x - 11, y + 2.5, z + 11);

		obj.add(par6R3Mesh);
		objects.push(par6R3Mesh);
		parametricMeshes.push(par6R3Mesh);
	}
}

function createParametric7(obj, x, y, z) {
	'use strict';

	function functionP(u, v, vector) {
		var height = 6;

		var base = [
			[-1, -1],
			[1, -1],
			[1, 1],
			[-1, 1],
			[0, 0]
		];

		var h = u * height;

		var baseVertexIndex = Math.floor(v * 4);
		var baseVertex1 = base[baseVertexIndex];
		var baseVertex2 = base[(baseVertexIndex + 1) % 4];
		var baseX = baseVertex1[0] * (1 - v) + baseVertex2[0] * v;
		var baseY = baseVertex1[1] * (1 - v) + baseVertex2[1] * v;

		var xCoord = baseX * (1 - h / height);
		var yCoord = baseY * (1 - h / height);
		var zCoord = h;

		vector.set(xCoord, yCoord, zCoord - 2);

	}
	if (obj == ring1) {
		par7R1Geometry = new ParametricGeometry(functionP, 32, 32);
		par7R1Mesh = new THREE.Mesh(par7R1Geometry, phongMaterials["light yellow"]);
		par7R1Mesh.position.set(x, y + 1.3, z + 15);

		obj.add(par7R1Mesh);
		objects.push(par7R1Mesh);
		parametricMeshes.push(par7R1Mesh);
	}
	if (obj == ring2) {
		par7R2Geometry = new ParametricGeometry(functionP, 32, 32);
		par7R2Mesh = new THREE.Mesh(par7R2Geometry, phongMaterials["dark blue"]);
		par7R2Mesh.position.set(x, y + 1.3, z + 15);

		obj.add(par7R2Mesh);
		objects.push(par7R2Mesh);
		parametricMeshes.push(par7R2Mesh);
	}
	if (obj == ring3) {
		par7R3Geometry = new ParametricGeometry(functionP, 32, 32);
		par7R3Mesh = new THREE.Mesh(par7R3Geometry, phongMaterials["pink"]);
		par7R3Mesh.position.set(x, y + 1.3, z + 15);

		obj.add(par7R3Mesh);
		objects.push(par7R3Mesh);
		parametricMeshes.push(par7R3Mesh);
	}
}

function createParametric8(obj, x, y, z) {
	'use strict';

	function functionP(u, v, vector) {
		var baseRadius = 1;
		var topRadius = 3;
		var height = 5;

		var xpos, ypos, zpos;

		if (v < 0.05) { // base
			var r = baseRadius * v;
			xpos = r * Math.cos(u * 2 * Math.PI);
			ypos = -height / 2;
			zpos = r * Math.sin(u * 2 * Math.PI);
		} else if (v > 0.95) { // top
			var r = topRadius * ((1 - v) / 0.05);
			xpos = r * Math.cos(u * 2 * Math.PI);
			ypos = height / 2;
			zpos = r * Math.sin(u * 2 * Math.PI);
		} else { // boddy
			var blendRadius = baseRadius - (baseRadius - topRadius) * (v - 0.05) / 0.9;
			xpos = blendRadius * Math.cos(u * 2 * Math.PI);
			ypos = v * height - height / 2;
			zpos = blendRadius * Math.sin(u * 2 * Math.PI);
		}

		// Inclinação do cilindro
		var tiltAngle = Math.PI / 6; // Ângulo de inclinação (30 graus)
		var newXpos = xpos;
		var newZpos = zpos * Math.cos(tiltAngle) - ypos * Math.sin(tiltAngle);
		ypos = zpos * Math.sin(tiltAngle) + ypos * Math.cos(tiltAngle);

		vector.set(newXpos, ypos, newZpos);

	}
	if (obj == ring1) {
		par8R1Geometry = new ParametricGeometry(functionP, 32, 32);
		par8R1Mesh = new THREE.Mesh(par8R1Geometry, gouraudMaterials["white"]);
		par8R1Mesh.position.set(x + 11, y + 2.6, z + 11);

		obj.add(par8R1Mesh);
		objects.push(par8R1Mesh);
		parametricMeshes.push(par8R1Mesh);
	}
	if (obj == ring2) {
		par8R2Geometry = new ParametricGeometry(functionP, 32, 32);
		par8R2Mesh = new THREE.Mesh(par8R2Geometry, gouraudMaterials["green"]);
		par8R2Mesh.position.set(x + 11, y + 2.6, z + 11);

		obj.add(par8R2Mesh);
		objects.push(par8R2Mesh);
		parametricMeshes.push(par8R2Mesh);
	}
	if (obj == ring3) {
		par8R3Geometry = new ParametricGeometry(functionP, 32, 32);
		par8R3Mesh = new THREE.Mesh(par8R3Geometry, gouraudMaterials["orange"]);
		par8R3Mesh.position.set(x + 11, y + 2.6, z + 11);

		obj.add(par8R3Mesh);
		objects.push(par8R3Mesh);
		parametricMeshes.push(par8R3Mesh);
	}
}

function createMobiusStrip(obj, x, y, z) {
	'use strict';
	const vertices = new Float32Array([
		8, 0, 0,
		12, 0, 0,
		6.55, -0.62, 4.76,
		9.63, 0.62, 7,
		2.59, -1.18, 7.97,
		3.59, 1.18, 11.05,
		-2.73, -1.62, 8.4,
		-3.45, 1.62, 10.63,
		-7.59, -1.9, 5.51,
		-8.59, 1.9, 6.24,
		-10, -2, 1.22,
		-10, 2, 0,
		-8.59, -1.9, -6.24,
		-7.59, 1.9, -5.51,
		-3.45, -1.62, -10.63,
		-2.73, 1.62, -8.4,
		3.59, -1.18, -11.05,
		2.59, 1.18, -7.97,
		9.63, -0.62, -7,
		6.55, 0.62, -4.76,
	]);


	const indices = [
		0, 1, 3,
		0, 3, 2,
		2, 3, 5,
		2, 5, 4,
		4, 5, 7,
		4, 7, 6,
		6, 7, 9,
		6, 9, 8,
		8, 9, 11,
		8, 11, 10,
		10, 11, 13,
		10, 13, 12,
		12, 13, 15,
		12, 15, 14,
		14, 15, 17,
		14, 17, 16,
		16, 17, 19,
		16, 19, 18,
		18, 19, 1,
		18, 1, 0,
	];
	mobiusGeometry = new THREE.BufferGeometry();
	mobiusGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
	mobiusGeometry.setIndex(indices);
	mobiusGeometry.computeVertexNormals();

	mobiusMesh = new THREE.Mesh(mobiusGeometry, basicMaterials["green"]);
	mobiusMesh.position.set(x, y, z);
	obj.add(mobiusMesh)
}
//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
	'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
	'use strict';

}

function createRandomRotation() {
	'use strict';

	for (var i = 0; i < parametricMeshes.length; i++) {
		var vector = []
		var n = 0;
		var x = Math.floor(Math.random() * 2);
		var y = Math.floor(Math.random() * 2);
		var z = Math.floor(Math.random() * 2);
		n = x + y + z;
		if (n == 0) {
			x = 1;
		} else {
			x = x / n;
			y = y / n;
			z = z / n;
		}
		vector.push(x);
		vector.push(y);
		vector.push(z);
		parametricRotations.push(vector);
	}
}

////////////
/* UPDATE */
////////////
function update() {
	'use strict';
	var delta = clock.getDelta();
	if (key1) {
		moveRing(ring1, direction1, delta);
		checkBoundariesRing1();
	}
	if (key2) {
		moveRing(ring2, direction2, delta);
		checkBoundariesRing2();
	}
	if (key3) {
		moveRing(ring3, direction3, delta);
		checkBoundariesRing3();
	}

	carousel.rotation.y += 0.01;

	for (var i = 0; i < parametricMeshes.length; i++) {
		parametricMeshes[i].rotation.x -= parametricRotations[i][0] * 0.06;
		parametricMeshes[i].rotation.y -= parametricRotations[i][1] * 0.06;
		parametricMeshes[i].rotation.z -= parametricRotations[i][2] * 0.06;
	}
	if (spotlights) {
		for (var i = 0; i < parametricSpotlights.length; i++) {
			parametricSpotlights[i].visible = !parametricSpotlights[i].visible;
			spotlights = false;
		}
	}
	if (ToggleDirectionalLight) {
		directionalLight.visible = !directionalLight.visible;
		ToggleDirectionalLight = false;
	}

	if (GouraudActive) {
		for (var i = 0; i < objects.length; i++) {
			// Get an array of the color names
			var colorNames = Object.keys(gouraudMaterials);

			// Select a random color name
			var randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

			// Use the random color name to access a random material
			var randomMaterial = gouraudMaterials[randomColorName];

			// Assign the random material to the object
			objects[i].material = randomMaterial;
		}
		GouraudActive = false;
	}

	if (PhongActive) {
		for (var i = 0; i < objects.length; i++) {
			// Get an array of the color names
			var colorNames = Object.keys(gouraudMaterials);

			// Select a random color name
			var randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

			// Use the random color name to access a random material
			var randomMaterial = phongMaterials[randomColorName];

			// Assign the random material to the object
			objects[i].material = randomMaterial;
		}
		PhongActive = false;
	}

	if (CartoonActive) {
		for (var i = 0; i < objects.length; i++) {
			// Get an array of the color names
			var colorNames = Object.keys(gouraudMaterials);

			// Select a random color name
			var randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

			// Use the random color name to access a random material
			var randomMaterial = cartoonMaterials[randomColorName];

			// Assign the random material to the object
			objects[i].material = randomMaterial;
		}
		CartoonActive = false;
	}

	if (NormalMapActive) {
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

				// Get an array of the color names
				var colorNames = Object.keys(gouraudMaterials);

				// Select a random color name
				var randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

				// Use the random color name to access a random material
				var randomMaterial = basicMaterials[randomColorName];

				// Assign the random material to the object
				objects[i].material = randomMaterial;
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
	'use strict';
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

	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	renderer.xr.enabled = true;
	document.body.appendChild(VRButton.createButton(renderer));

	createScene();
	createCamera();

	createObjects();
	createRandomRotation();

	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
	'use strict';


	update();
	render();

	renderer.setAnimationLoop(function () {

		renderer.render(scene, camera);

	});

	// requestAnimationFrame(animate);
	renderer.setAnimationLoop(animate);
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

//////////////////////////////
/* CRANE MOVEMENT FUNCTIONS */
//////////////////////////////
function moveRing(object, direction, delta) {
	object.position.y += direction * 8 * delta;
}

function checkBoundariesRing1() {
	if (ring1.position.y >= 53) {
		ring1.position.y = 53;
		direction1 = -1;
	} else if (ring1.position.y <= 7) {
		ring1.position.y = 7;
		direction1 = 1;
	}
}
function checkBoundariesRing2() {
	if (ring2.position.y >= 53) {
		ring2.position.y = 53;
		direction2 = -1;
	} else if (ring2.position.y <= 7) {
		ring2.position.y = 7;
		direction2 = 1;
	}
}
function checkBoundariesRing3() {
	if (ring3.position.y >= 53) {
		ring3.position.y = 53;
		direction3 = -1;
	} else if (ring3.position.y <= 7) {
		ring3.position.y = 7;
		direction3 = 1;
	}
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
	'use strict';
	switch (e.keyCode) {
		case 49: if (key1) {
			key1 = false;
		} else {
			key1 = true;
		}; break; // 1
		case 50: if (key2) {
			key2 = false;
		} else {
			key2 = true;
		}; break; // 2
		case 51: if (key3) {
			key3 = false;
		} else {
			key3 = true;
		}; break; // 3

		case 80: spotlights = true; break; // P/p
		case 83: spotlights = false; break; // S/s

		case 68: case 100: ToggleDirectionalLight = true; break; // D/d

		case 81: GouraudActive = true; break; // Q/q
		case 87: PhongActive = true; break;   // W/w
		case 69: CartoonActive = true; break; // E/e
		case 82: NormalMapActive = true; break; // R/r

		case 84: toggleBasic = true; break; // T/t
	}

}

init();
animate();
