import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

/**
 * Axes heloper
 */

 const axesHelper = new THREE.AxesHelper(600);
 

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
    sprite1.position.set( event.clientX, event.clientY, 0 );
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
scene.add(axesHelper);

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
 const r = radius/2, starsGeometry = [ new THREE.BufferGeometry(), new THREE.BufferGeometry() ];

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


 //stackoverflow answer


 function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); ctx.fill(); ctx.stroke(); }

 function makeTextSprite( message, parameters )
    {
        if ( parameters === undefined ) parameters = {};
        let fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
        let fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 144;
        let borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
        let borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
        let backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
        let textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;
        let metrics = context.measureText( message );
        let textWidth = metrics.width;

        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

        context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
        context.fillText( message, borderThickness, fontsize + borderThickness);

        let texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        let spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
        let sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
        return sprite;
    }

 // #end of the anser

 /**
  * ToolTip
//   */
//   let tooltip = document.createElement('p');
//   canvas1.width = 1000
//   canvas1.height = 1000
//   let context1 = canvas1.getContext('2d');
//   context1.font = "Bold 20px Arial";
//   context1.fillStyle = "rgba(0,0,0,0.95)";
//   context1.fillText('Hello, world!', 0, 20);

//   // canvas contents will be used for a texture
//   let texture1 = new THREE.Texture(canvas1) 
//   texture1.needsUpdate = true;

//   ////////////////////////////////////////

//   let spriteMaterial = new THREE.SpriteMaterial( { map: texture1 } );

//   let sprite1 = new THREE.Sprite( spriteMaterial );
//   sprite1.scale.set(200,100,1.0);
//   sprite1.position.set( 50, 50, 0 );



const sprite1 =  makeTextSprite("this is a message",{} )
   scene.add( sprite1 );


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

			}
			else
			{
                gsap.to(intersected.scale, { duration: .3, delay: 0, x: 1,y: 1,z: 1 })
            }
		}
	}
	else // there are no intersections
	{
		// restore previous intersection object (if it exists) to its original color
		if ( intersected )
        {
            gsap.to(intersected.scale, { duration: .3, delay: 0, x: 1,y: 1,z: 1 })
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