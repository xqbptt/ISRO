import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

/**
 * Axes heloper
 */

//  const axesHelper = new THREE.AxesHelper(600);
 

/**
 * Mouse variables
 */

 const raycaster = new THREE.Raycaster();
 const mouse = new THREE.Vector2();
 let targetList = [];
 let intersected;

 window.addEventListener( 'mousemove', (event)=>{
     // calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
    tooltip.style.top = (event.clientY-30) + "px";
    tooltip.style.left = (event.clientX-30) + "px";
	mouse.x = ( event.clientX / sizes.width ) * 2 - 1;
	mouse.y = - ( event.clientY / sizes.height ) * 2 + 1;
 }, false );


const radius = 10000
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// scene.add(axesHelper);


/**
 * Texture
 */

// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load("/textures/base/Marble_Blue_004_basecolor.jpg",
// ()=>{
//     console.log('load')
// },
// ()=>{
//     console.log('progress')
// },
// ()=>{
//     conso
// }
// )


/**
 * Base
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)

// base sphere
let sphereGeom =  new THREE.SphereGeometry( radius, 64 , 64 )
// Basic wireframe materials
let wireframeMaterial = new THREE.MeshNormalMaterial( {  wireframe: true } )

// Creating three spheres to illustrate wireframes.
let sphere = new THREE.Mesh( sphereGeom, wireframeMaterial )
 sphere.position.set(0, 0, 0);
sphere.name = "base";
scene.add( sphere );

//scene.add(mesh)

/**
 * Stars
 */

 const vertices = [
{    x:radius-10,
    y:0,
    z:0,
},
{x:0,
y:radius-10,
z:0,
},
{x:0,
y:0,
z:radius-10,
},
{x:0,
y:-radius-10,
z:0,
},
 ];

 const geometry = new THREE.SphereGeometry( 50, 32 )
 const material = new THREE.MeshBasicMaterial( { color: 0xffffff } )

vertices.forEach(({x, y, z}, i)=>{
    // console.log({x, y, z});
    // console.log(i);
    let star = new THREE.Mesh( geometry , material )
    star.position.set( x,y,z)
    star.name = `source_${i}`
    targetList.push(star)
    console.log(star.name)
    scene.add( star );
})

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
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// camera.position.z = 3
// scene.add(camera)

// var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 300;
// camera attributes
const viewAngle = 45, aspect = sizes.width / sizes.height, near = 0.1, far = 500000
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
controls.enableDamping = true;

/**
 * Stars in background
 */
 const r = radius/4, starsGeometry = [ new THREE.BufferGeometry(), new THREE.BufferGeometry() ];

 const vertices1 = [];
 const vertices2 = [];

 const vertex = new THREE.Vector3();

 for ( let i = 0; i < 250; i ++ ) {

     vertex.x = Math.random() * 2 - 1;
     vertex.y = Math.random() * 2 - 1;
     vertex.z = Math.random() * 2 - 1;
     vertex.multiplyScalar( r );

     vertices1.push( vertex.x, vertex.y, vertex.z );

 }

 for ( let i = 0; i < 1500; i ++ ) {

     vertex.x = Math.random() * 2 - 1;
     vertex.y = Math.random() * 2 - 1;
     vertex.z = Math.random() * 2 - 1;
     vertex.multiplyScalar( r );

     vertices2.push( vertex.x, vertex.y, vertex.z );

 }

 starsGeometry[ 0 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
 starsGeometry[ 1 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );

 const starsMaterials = [
     new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
     new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
     new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
     new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
     new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
     new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
 ];

 for ( let i = 10; i < 30; i ++ ) {

     const stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

     stars.rotation.x = Math.random() * 6;
     stars.rotation.y = Math.random() * 6;
     stars.rotation.z = Math.random() * 6;
     stars.scale.setScalar( i * 10 );

     stars.matrixAutoUpdate = false;
     stars.updateMatrix();

     scene.add( stars );

 }

 /**
  * ToolTip
  */
let tooltip = document.getElementById("tooltip")
tooltip.style.display = "none"

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
    const intersects = raycaster.intersectObjects( targetList );
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
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
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
	const intersects = raycaster.intersectObjects( targetList );

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