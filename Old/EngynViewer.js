function EngynViewer() {

    // global variables
    var renderer, scene, camera;
    var control, stats, controls;
    var maxdistance, modelo;
    var spotLight, gridHelper;

    /**
     * Initializes the scene, camera and objects. Called when the window is
     * loaded by using window.onload (see below)
     */
    function init() {

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene();
        maxdistance = 100000;
        
        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 15, maxdistance*2);
        camera.position.x = maxdistance*0.5;
        camera.position.y = maxdistance*0.5;
        camera.position.z = maxdistance;

        // create a render, sets the background color and the size
        renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        renderer.setClearColor(0x000000, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild( renderer.domElement );
        renderer.shadowMapEnabled = true;

        //Create controls to enable pan y zoom
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render );
        controls.enableZoom = true;
        controls.minDistance = 20;
        controls.maxDistance = maxdistance;
        controls.enablePan = true;
   
        //Add a HemisphereLight
        var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .9)
        scene.add(hemisphereLight);

        //Add a directional light
        spotLight = new THREE.DirectionalLight( 0xD9FBFF, 0.9 );
        spotLight.position.set( 30,10,-10 );
        spotLight.castShadow = true;
        spotLight.shadowDarkness = 0.5;
        spotLight.shadowCameraVisible = false;
        spotLight.shadowBias = 0.1;
        spotLight.shadowMapWidth = maxdistance;
        spotLight.shadowMapHeight = maxdistance;
        spotLight.shadowCameraRight = maxdistance;
        spotLight.shadowCameraLeft = maxdistance*-1;
        spotLight.shadowCameraTop = maxdistance;
        spotLight.shadowCameraBottom = maxdistance*-1;
        spotLight.shadowCameraFar = maxdistance;
        spotLight.shadowCameraNear = 0.1;
        scene.add( spotLight )

        

        //Add gridline
        gridHelper = new THREE.GridHelper( 50000, 1000 );
        gridHelper.visible = false;
        scene.add( gridHelper );


        //SKYDOME
        var vertexShader = document.getElementById( 'vertexShader' ).textContent;
				var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
				var uniforms = {
					topColor: { type: "c", value: new THREE.Color( 0xd9e9f9 ) },
					bottomColor: { type: "c", value: new THREE.Color( 0xefefef ) },
					offset: { type: "f", value: 400 },
					exponent: { type: "f", value: 0.6 }
				};
				uniforms.topColor.value.copy( spotLight.color );
				
        var skyGeo = new THREE.SphereGeometry( maxdistance, 32, 15 );
				var skyMat = new THREE.ShaderMaterial( {
					uniforms: uniforms,
					vertexShader: vertexShader,
					fragmentShader: fragmentShader,
					side: THREE.BackSide
                    
				} );
				var sky = new THREE.Mesh( skyGeo, skyMat );
				scene.add( sky );

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(20, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = -2;
        plane.position.z = 0;

      
        // add extras
        addStatsObject();

        // loadModel();
        loadModel();


        animate();

        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        render();

        addControlGui();

        controls.update();
     
    }

    //Load customized Json file
    function loadModel() {
        var loader = new THREE.ObjectLoader();
        loader.load("assets/models/exported/HouseRevit1.js",
            function (model) {
            model.castShadow = true;
            // var helper = new THREE.EdgesHelper( model, 0xffffff );
            // helper.material.linewidth = 2;
            // scene.add(helper);

            //var edges = new THREE.EdgesGeometry( model );
            //var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
            // scene.add( line );

            scene.add(model);         
        });
        
    }
    


          
            // var boundingBox = new THREE.Box3().setFromObject(model);
            // var boundingValues = [Math.abs(boundingBox.min.x), Math.abs(boundingBox.max.x), 
            // Math.abs(boundingBox.min.y), Math.abs(boundingBox.max.y), 
            // Math.abs(boundingBox.min.z), Math.abs(boundingBox.max.z)]; 
            // largest = Math.max.apply(Math, boundingValues);
             



            
    function addControlGui() {
        var gui = new dat.GUI();
        
        var params = {
					intensity: spotLight.intensity,
				};
        gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {
					spotLight.intensity = val;
					render();
				} );

        var props = {
	                hideBars: gridHelper.visible,
				};
         gui.add(props,'hideBars').name('Grid').onChange( function ( val ) {
					gridHelper.visible = val;
                    render();
                } );
        
        
    }

    function addStatsObject() {
        stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild( stats.domElement );
    }

    /**
     * Called when the scene needs to be rendered. Delegates to requestAnimationFrame
     * for future renders
     */
    function render() {

        // update stats
        stats.update();

        // and render the scene
        renderer.render(scene, camera);

        // render using requestAnimationFrame
        //requestAnimationFrame(render);
    }

    /**
     * Function handles the resize event. This make sure the camera and the renderer
     * are updated at the correct moment.
     */
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame( animate );
        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();
        renderer.render( scene, camera );
    }

    // calls the init function when the window is done loading.
    window.onload = init;
    // calls the handleResize function when the window is resized
    window.addEventListener('resize', handleResize, false);
  }