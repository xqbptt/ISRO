import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls.js"
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls.js"

 const request = async () => {
 /**
 * Open JSON file
 */
const response1 = await fetch("json_data/high_energy_sources.json");
const high_energy_json = await response1.json()
const response2 = await fetch("json_data/low_energy_sources.json");
const low_energy_json = await response2.json()
console.log(high_energy_json.length);
    
/**
 * Mouse variables
 */
 const raycaster = new THREE.Raycaster();
 const mouse = new THREE.Vector2();
 let targetListAll = [];
 let targetListObserved = [];
 let intersected;

/**
 * ToolTip
 */
let tooltip = document.getElementById("tooltip")
tooltip.style.display = "none"


window.addEventListener( 'mousemove', (event)=>{
     // calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
    tooltip.style.top = (event.clientY-30) + "px";
    tooltip.style.left = (event.clientX-30) + "px";
	mouse.x = ( event.clientX / sizes.width ) * 2 - 1;
	mouse.y = - ( event.clientY / sizes.height ) * 2 + 1;
}, false );



const radius = 5000 //radius of the celestial sphere
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.CubeTextureLoader()
	.setPath( 'textures/cubeMaps/' )
	.load( [
		'px.png',
		'nx.png',
		'py.png',
		'ny.png',
		'pz.png',
		'nz.png'
	] );
// scene.add(axesHelper);

/**
 * Celestial Sphere
 */
const textureLoader = new THREE.TextureLoader();
// base celestial sphere
let sphereGeom =  new THREE.SphereGeometry( radius, 128 , 128 )
// Basic wireframe material
let wireframeMaterial = new THREE.MeshNormalMaterial( { color: 0x000077, transparent: true, opacity: 0.5,  wireframe: true } )
let sphere = new THREE.Mesh( sphereGeom, wireframeMaterial ) //keeping it wireframe for now
sphere.name = "base";
scene.add( sphere );
//Earth material
const materialNormalMap = new THREE.MeshPhongMaterial( {

    specular: 0x333333,
    shininess: 15,
    map: textureLoader.load( "textures/planet/earth_atmos_4096.jpg" ),
    specularMap: textureLoader.load( "textures/planet/earth_specular_2048.jpg" ),
    lightMap: textureLoader.load( "textures/planet/earth_lights_2048.jpg" ),
    wireframe: true,
    transparent: true,
    opacity: 0.25,
    // y scale is negated to compensate for normal map handedness.
    normalScale: new THREE.Vector2( 0.85, - 0.85 )

} );
// geometry of earth sphere which is a little bit smaller than outer sphere, so that they dont overlap
const geometry = new THREE.SphereGeometry( radius, 128, 128 );

let meshPlanet = new THREE.Mesh( geometry, materialNormalMap );
scene.add( meshPlanet );


/**
 * Light
 */
const dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( - 1, 0, 1 ).normalize();
scene.add( dirLight );

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(0.5, 0, 1);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 40000;
scene.add(pointLight);

//scene.add(mesh)

/**
 * Stars
 */

 const geometryObserved = new THREE.SphereGeometry( 20, 8 )
 const geometryNotObserved = new THREE.SphereGeometry( 15, 8 )
 const materialObserved = new THREE.MeshBasicMaterial( { color: 0x009900 } )
 const materialNotObserved = new THREE.MeshBasicMaterial( { color: 0x000099 } )
console.log(high_energy_json)
for(let i = 0; i<high_energy_json.length; i = i+1)
{
    // console.log({x, y, z});
    // console.log(i);
    console.log(high_energy_json[i])
    let star;
    if(high_energy_json[i]["ISRO Observed"] == "True")
        star = new THREE.Mesh( geometryObserved , materialObserved )
    else
        star = new THREE.Mesh( geometryNotObserved , materialNotObserved )
    console.log(high_energy_json[i]["x"])
    star.position.set( radius*parseFloat(high_energy_json[i]["x"]),radius*parseFloat(high_energy_json[i]["y"]),radius*parseFloat(high_energy_json[i]["z"]))
    star.name = high_energy_json[i]["Name"]
    star.ID = high_energy_json[i]["id"] //*IMPORTANT* NOTE: use "ID" and not "id" for reference
    //star.id = high_energy_json[i]["id"]
    console.log(star.position)
    targetListAll.push(star)
    if(high_energy_json[i]["ISRO Observed"] == "True")
        targetListObserved.push(star)
    console.log(star.ID)
    scene.add( star );
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// camera attributes
const viewAngle = 25, aspect = sizes.width / sizes.height, near = 0.1, far = 500000
// set up camera
const camera = new THREE.PerspectiveCamera( viewAngle, aspect, near, far)
// add the camera to the scene
scene.add(camera)
// the camera defaults to position (0,0,0)
// 	so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
camera.position.set(0,300,800);
camera.lookAt(scene.position);


/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.lookSpeed = 0.01
controls.enableDamping = true;

/**
 * Stars in background
 */
//  const r = radius/8, starsGeometry = [ new THREE.BufferGeometry(), new THREE.BufferGeometry() ];

//  const vertices1 = [];
//  const vertices2 = [];

//  const vertex = new THREE.Vector3();

//  for ( let i = 0; i < 500; i ++ ) {

//      vertex.x = Math.random() * 2 - 1;
//      vertex.y = Math.random() * 2 - 1;
//      vertex.z = Math.random() * 2 - 1;
//      vertex.multiplyScalar( r );

//      vertices1.push( vertex.x, vertex.y, vertex.z );

//  }

//  for ( let i = 0; i < 3000; i ++ ) {

//      vertex.x = Math.random() * 2 - 1;
//      vertex.y = Math.random() * 2 - 1;
//      vertex.z = Math.random() * 2 - 1;
//      vertex.multiplyScalar( r );

//      vertices2.push( vertex.x, vertex.y, vertex.z );

//  }

//  starsGeometry[ 0 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
//  starsGeometry[ 1 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );

//  const starsMaterials = [
//      new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
//      new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
//      new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
//      new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
//      new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
//      new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
//  ];

//  for ( let i = 10; i < 1000; i ++ ) {

//      const stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

//      stars.rotation.x = Math.random() * 6;
//      stars.rotation.y = Math.random() * 6;
//      stars.rotation.z = Math.random() * 6;
//      stars.scale.setScalar( i * 10 );

//      stars.matrixAutoUpdate = false;
//      stars.updateMatrix();

//      scene.add( stars );

//  }


/**
 * Mouse Click
 */
console.log("adding event listener")
document.addEventListener('click', (event) => {
    console.log("Click.");
	// update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	// find intersections
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( targetListObserved );
    if(intersects.length>0){
        let intersected_object = intersects[0];
        console.log("Hit " );
        if ( intersected_object.object.name )
        {
            let modal = document.getElementById("myModal");
            let span = document.getElementsByClassName("close")[0];
            let displayText = document.getElementById("text");
            displayText.innerHTML = "Publications related to " + intersected_object.object.name;
            modal.style.display = "block";
            span.onclick = function() {
            modal.style.display = "none";
            }
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        }
	}
}, false );


/**
 * Toggle View
 */
const toggleButton = document.getElementById("center")
toggleButton.onclick = ()=>{
    if(camera.position.x > 20 || camera.position.y > 20 || camera.position.z > 20) {
        //camera.position.set(0,0,1);
        gsap.to(camera.position, { duration: 1, delay: 0, x: 0,y: 0,z: 10 })
        //camera.lookAt(300,300,300);
    }
    else {
        //camera.position.set(0,300,radius+radius)
        gsap.to(camera.position, { duration: 1, delay: 0, x: 0,y: 300,z: 2*radius })
    }
       
}
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true
})
renderer.setSize(sizes.width, sizes.height)





/**
 * Animate
 */


const tick = () =>
{
    // controlFrictionLikeEffect
    controls.update()


    // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( targetListAll );

	for ( let i = 0; i < intersects.length; i ++ ) {

		console.log(intersects[ i ].object.material)
	}
    if(intersects.length>0){
        if ( intersects[ 0 ].object != intersected)
		{
		    // restore previous intersection object (if it exists) to its original color
			if ( intersected )
				{
                    intersected.scale.set( 1,1,1 );
                    tooltip.style.display = "none"
                }
			// store reference to closest object as current intersection object
			intersected = intersects[ 0 ].object;
			// store color of closest object (for later restorati
			// set a new color for closest object

			// update text, if it has a "name" field.
			if ( intersects[ 0 ].object.name )
			{
                console.log(intersected.name)
                gsap.to(intersected.scale, { duration: .5, delay: 0, x: 2,y: 2,z: 2 })
                tooltip.innerHTML = intersected.name
                tooltip.style.display = "block"
            }
			else
			{
                gsap.to(intersected.scale, { duration: .3, delay: 0, x: 1,y: 1,z: 1 })
                tooltip.style.display = "none"
            }
		}
	}
	else // there are no intersections
	{
		// restore previous intersection object (if it exists) to its original color
		if ( intersected )
        {
            gsap.to(intersected.scale, { duration: .3, delay: 0, x: 1,y: 1,z: 1 })
            tooltip.style.display = "none"
        }
		// remove previous intersection object reference
		//     by setting current intersection object to "nothing"
		intersected = null;
	}




    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
}

 request();