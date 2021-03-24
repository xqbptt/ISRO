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
const response1 = await fetch("json_data/High_Energy.json");
const high_energy_json = await response1.json()
const response2 = await fetch("json_data/Low_Energy.json");
const low_energy_json = await response2.json()

let nameList = []; //name list for searching
let highEnergyObjects = [];
let lowEnergyObjects = [];
let HEUnObserved = [];
let LEUnobserved = [];
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
	.setPath( 'textures/cubeMaps/nb_' )
	.load( [
		'px.png',
		'nx.png',
		'py.png',
		'ny.png',
		'pz.png',
		'nz.png'
	] );

/**
 * Celestial Sphere
 */
const textureLoader = new THREE.TextureLoader();
// base celestial sphere
let sphereGeom =  new THREE.SphereGeometry( radius, 128 , 128 )
// Basic wireframe material
let wireframeMaterial = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.5,  wireframe: true } )
let sphere = new THREE.Mesh( sphereGeom, wireframeMaterial )
sphere.name = "base";
scene.add( sphere );
//Earth material
const materialNormalMap = new THREE.MeshPhongMaterial( {

    specular: 0x333333,
    shininess: 15,
    map: textureLoader.load( "textures/planet/earth_atmos_4096.jpg" ),
    specularMap: textureLoader.load( "textures/planet/earth_specular_2048.jpg" ),
    lightMap: textureLoader.load( "textures/planet/earth_lights_2048.png" ),
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

const glowHE = new THREE.SpriteMaterial( { 
    map: textureLoader.load('textures/stars/flare-red1.png'), 
    color: 0xffffff, 
    transparent: true,
    opacity: 0.8,
    depthTest: false 
} );
const glowLE = new THREE.SpriteMaterial( { 
    map: textureLoader.load('textures/stars/flare-green1.png'), 
    color: 0xffffff, 
    transparent: true,
    opacity: 0.8,
    depthTest: false 
} );
const glowHEUnObs = new THREE.SpriteMaterial( { 
    map: textureLoader.load('textures/stars/flare-red1light.png'), 
    color: 0xffffff,
    transparent: true,
    opacity: 0.5, 
    depthTest: false 
} );
const glowLEUnObs = new THREE.SpriteMaterial( { 
    map: textureLoader.load('textures/stars/flare-green1light.png'), 
    color: 0xffffff, 
    transparent: true,
    opacity: 0.5,
    depthTest: false 
} );

 const geometryStar = new THREE.SphereGeometry( 20, 8 )
 const materialStar = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true , opacity:0.5} )
for(let i = 0; i<high_energy_json.length; i = i+1)
{
    // console.log({x, y, z});
    // console.log(i);
    let star = new THREE.Mesh( geometryStar , materialStar )
    star.position.set( radius*parseFloat(high_energy_json[i]["x"]),radius*parseFloat(high_energy_json[i]["y"]),radius*parseFloat(high_energy_json[i]["z"]))
    star.name = high_energy_json[i]["Name"]
    nameList.push({name: star.name,pos: star.position}) //for searching
    star.info = high_energy_json[i]
    targetListAll.push(star)
    let sprite
    
    if(high_energy_json[i]["ISRO Observed"] == "TRUE"){
        highEnergyObjects.push(star)
        targetListObserved.push(star)
        sprite = new THREE.Sprite(glowHE)
    }
    else {
        HEUnObserved.push(star)
        sprite = new THREE.Sprite(glowHEUnObs)
    }
    sprite.scale.set(400, 400, 1)   
    star.add(sprite)
    scene.add( star );
}

for(let i = 0; i<low_energy_json.length; i = i+1)
{
    let star = new THREE.Mesh( geometryStar , materialStar )
    star.position.set( radius*parseFloat(low_energy_json[i]["x"]),radius*parseFloat(low_energy_json[i]["y"]),radius*parseFloat(low_energy_json[i]["z"]))
    star.name = low_energy_json[i]["Name"]
    star.info = low_energy_json[i]
    targetListAll.push(star)
    let sprite
    
    if(low_energy_json[i]["ISRO Observed"] == "TRUE"){
        targetListObserved.push(star)
        lowEnergyObjects.push(star)
        sprite = new THREE.Sprite(glowLE)
    }
    else {
        LEUnobserved.push(star)
        sprite = new THREE.Sprite(glowLEUnObs)
    }
    nameList.push({name: star.name,pos: star.position}) 
    sprite.scale.set(400, 400, 1)   
    star.add(sprite)
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
 * Mouse Click
 */
document.addEventListener('click', (event) => {
	// update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	// find intersections
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( targetListAll );
    if(intersects.length>0){
        let intersected_object = intersects[0];
        if ( intersected_object.object.name )
        {
            let info = intersected_object.object.info;
            let modal = document.getElementById("myModal");
            let span = document.getElementsByClassName("close")[0];
            /**
             * pdf download
             */
            let pdf_button = document.getElementById("pdf-download")
            pdf_button.addEventListener("click", () => {
                let el = document.querySelector(".modal-content");
                html2pdf()
                  .from(el)
                  .set({
                    margin: 0,
                    filename: info["Name"]+"_astrosat.pdf"
                  })
                  .save();
              });
            document.getElementById("name").innerHTML =  info["Name"]
            if(info["ISRO Observed"]=="TRUE")
                document.getElementById("obs_name").innerHTML = "The source, as observed by ISRO has been named " + info["Observation Name"]
            else
                document.getElementById("obs_name").innerHTML = "The source has not been observed by ISRO"
            document.getElementById("rt_asc_hr").innerHTML = info["RA (h)"];
            document.getElementById("rt_asc_mn").innerHTML = info["RA (min)"];
            document.getElementById("rt_asc_sc").innerHTML = info["RA (sec)"];
            document.getElementById("dec_deg").innerHTML = info["DE (deg)"];
            document.getElementById("dec_acmn").innerHTML = info["DE (arcmin)"];
            document.getElementById("dec_acsc").innerHTML = info["DE (arcsec)"];
            document.getElementById("gal_long").innerHTML = info["Galactic Longitude (deg)"];
            document.getElementById("gal_lat").innerHTML = info["Galactic Lattitude (deg)"];
            document.getElementById("pos_acc").innerHTML = info["Position Accuracy (arcsec)"];
            document.getElementById("avg_flux").innerHTML = info["Average Flux (mag)"];
            document.getElementById("orb_per").innerHTML = info["Orbital Period (d)"];
            document.getElementById("range").innerHTML = info["Range"];
            document.getElementById("pls_per").innerHTML = info["Pulse Period (s)"];
            document.getElementById("sp_typ").innerHTML = info["Spectral Type"];

            // displayText.innerHTML = "Publications related to " + intersected_object.object.name;
            let pub_card = document.getElementById("pub-card")
            let url1 = document.getElementById("pub1")
            let url2 = document.getElementById("pub2")
            if(info["URL 1"] == "")
                pub_card.style.display = "none"
            else{
                pub_card.style.display = "block"
                url1.style.display = "block"
                url1.href = info["URL 1"]
                pub1.innerHTML = "&#10000; " +  info["Title 1"]
            }
            if(info["URL 2"] == "")
                url2.style.display = "none"
            else{
                url2.style.display = "block"
                url2.href = info["URL 2"]
                pub2.innerHTML = "&#10000; " +  info["Title 2"]
            }

            // Observation details
            let obs_details = document.getElementById("obs-det")
            console.log(info["ISRO details"])
            if(info["ISRO details"].length==0){
                obs_details.innerHTML = "";
                obs_details.style.display = "none";
            }
            else {
                obs_details.style.display = "block"
                obs_details.innerHTML = '<h1 class="title" style="font-size:36px; margin-top:-15px; margin-bottom:0px;"><b> Observation details </b></h1>'
                for(let i =0; i<info["ISRO details"].length; i=i+1)
                {
                    let element = '<div><h1 class="title" id="celest_coords" style="font-size:26px"><b>Serial No. ' +info["ISRO details"][i]["Serial Number"]+ '</b></h1>'
                    element+= '<p>&#127756; Observation Timestamp: '+ info["ISRO details"][i]["Observation_Timestamp"]+'</p>'
                    element+= '<p>&#127756; Proposal-ID: '+info["ISRO details"][i]["Proposal_ID"]+'</p>'
                    element+= '<p>&#127756; Target-ID: '+info["ISRO details"][i]["Target_ID"]+'</p>'
                    element+= '<p>&#127756; Right Ascension: '+info["ISRO details"][i]["RA"]+'</p>'
                    element+= '<p>&#127756; Declination:  '+info["ISRO details"][i]["Dec"]+'</p>'
                    element+= '<p>&#127756; Observation-ID:  '+info["ISRO details"][i]["Observation_ID"]+'</p>'
                    element+= '<p>&#127756; Source Name: '+info["ISRO details"][i]["Source_Name"]+'</p>'
                    element+= '<p>&#127756; Prime-Instrument:  '+info["ISRO details"][i]["Prime_Instrument"]+'</p>'
                    element+= '<br></div>'
                    obs_details.innerHTML += element;
                }

            }
                       
            canvas.style.filter = "blur(3px)"
            modal.style.visibility = "visible";
            modal.style.opacity = 1;
            span.onclick = function() {
                modal.style.visibility = "hidden";
                modal.style.opacity = 0;
                canvas.style.filter = "blur(0px)"
            }
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.visibility = "hidden";
                    modal.style.opacity = 0;
                    canvas.style.filter = "blur(0px)"
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
 * Control four modes
 */
const HEbutton = document.getElementById("he-button")
const LEbutton = document.getElementById("le-button")
const HEnobsButton = document.getElementById("nobs-he-button")
const LEnobsButton = document.getElementById("nobs-le-button")
HEbutton.onclick = ()=>{
    if(highEnergyObjects[0].visible)
    {
        HEbutton.children[0].style.background = "#2d3436"
        HEbutton.children[0].style.border = "solid 5px rgb(175, 33, 62)"
        for(let i=0; i<highEnergyObjects.length; i = i+1){
            highEnergyObjects[i].visible = false
        }
    }
    else {
        HEbutton.children[0].style.background = "rgb(175, 33, 62)"
        HEbutton.children[0].style.border = "solid 5px #2d3436"
        for(let i=0; i<highEnergyObjects.length; i = i+1){
            highEnergyObjects[i].visible = true
        }
    }
}
LEbutton.onclick = ()=>{
    if(lowEnergyObjects[0].visible)
    {
        LEbutton.children[0].style.background = "#2d3436"
        LEbutton.children[0].style.border = "solid 5px rgb(4, 160, 95)n"
        for(let i=0; i<lowEnergyObjects.length; i = i+1){
            lowEnergyObjects[i].visible = false
        }
    }
    else {
        LEbutton.children[0].style.background = "rgb(4, 160, 95)"
        LEbutton.children[0].style.border = "solid 5px #2d3436"
        for(let i=0; i<lowEnergyObjects.length; i = i+1){
            lowEnergyObjects[i].visible = true
        }
    }
}
HEnobsButton.onclick = ()=>{
    if(HEUnObserved[0].visible)
    {
        HEnobsButton.children[0].style.background = "#2d3436"
        HEnobsButton.children[0].style.border = "solid 5px rgb(84, 36, 138)"
        for(let i=0; i<HEUnObserved.length; i = i+1){
            HEUnObserved[i].visible = false
        }
    }
    else {
        HEnobsButton.children[0].style.background = "rgb(84, 36, 138)"
        HEnobsButton.children[0].style.border = "solid 5px #2d3436"
        for(let i=0; i<HEUnObserved.length; i = i+1){
            HEUnObserved[i].visible = true
        }
    }
}
LEnobsButton.onclick = ()=>{
    if(LEUnobserved[0].visible)
    {
        LEnobsButton.children[0].style.background = "#2d3436"
        LEnobsButton.children[0].style.border = "solid 5px rgb(125, 156, 38)"
        for(let i=0; i<LEUnobserved.length; i = i+1){
            LEUnobserved[i].visible = false
        }
    }
    else {
        LEnobsButton.children[0].style.background = "rgb(125, 156, 38)"
        LEnobsButton.children[0].style.border = "solid 5px #2d3436"
        for(let i=0; i<LEUnobserved.length; i = i+1){
            LEUnobserved[i].visible = true
        }
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
                gsap.to(intersected.scale, { duration: .5, delay: 0, x: 2,y: 2,z: 2 })
                tooltip.innerHTML = intersected.name
                console.log(tooltip.innerHTML)
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

    /**
     * Search Bar
     */

    //get required elements
    const searchBox = document.getElementById("searchBox")
    searchBox.onkeyup = (e)=>{
    if (e.key === "Enter") {
        // Cancel the default action, if needed
        e.preventDefault();
        let found = false;
        let input = e.target.value;
        for(let i =0; i<nameList.length; i=i+1) {
            console.log(nameList[i].name === input)
            if(nameList[i].name == input) {
                found = true
                searchBox.style.background = "#2d3436"
                gsap.to(camera.position, { duration: 1, delay: 0, x: nameList[i].pos.x*1.5,y: nameList[i].pos.y*1.5,z: nameList[i].pos.z*1.5 })
                // camera.position.set(nameList[i].pos.x*1.5,nameList[i].pos.y*1.5,nameList[i].pos.z*1.5)
                break;
            }
        }
        if(!found)
            searchBox.style.background = "#990000"
    }
    }
    

    // Render
    renderer.render(scene, camera)
    /**
     * handle window resize
     */
    window.addEventListener( 'resize', onWindowResize );

    function onWindowResize() {

        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize( width, height );

    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
}

 request();