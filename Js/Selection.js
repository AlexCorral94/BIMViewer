    //Define function when an element is double clicked
    function onDocumentMouseDown( event ) {

        event.preventDefault();    
        // find intersections
        _mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        _mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
        var vector = new THREE.Vector3( _mouse.x, _mouse.y, 1 );
        vector.unproject( camera );
        var ray = new THREE.Raycaster( camera.position, vector.sub(camera.position ).normalize() );
        var intersects = ray.intersectObjects( scene.children, true);     
        if(intersects[ 0 ].object.type != "Scene" &&
        intersects[ 0 ].object.name != "")
        {
            //Get object 3D
            currentElm = scene.getObjectByName(intersects[ 0 ].object.name);


            if ( intersects.length > 0 ) {  
                if(objectSel != undefined){
                    objectSel.material = oringinMaterial;
                }
                oringinMaterial = intersects[ 0 ].object.material;
                intersects[ 0 ].object.material = Selmaterial;          
                objectSel = intersects[ 0 ].object;
            }	   
            Object3D.Name = objectSel.name;
            gui1_X.updateDisplay();
        }
        else{
            objectSel.material = oringinMaterial;
            db.collection('models').doc('test1').update(model);
        }
    }

    function addCube(x, y, z){

        var geometry = new THREE.CubeGeometry( 200, 200, 200 );
        var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        var material = new THREE.MeshBasicMaterial( { color: randomColor } );
        var mesh = new THREE.Mesh( geometry, material );
            mesh.position.set(x, y, z);
      //scene is global
       scene.add(mesh);
    }

    function onContextMenu(event)
    {
        event.preventDefault();    
        // find intersections
        _mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        _mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
        var vector = new THREE.Vector3( _mouse.x, _mouse.y, 1 );
        vector.unproject( camera );
        var ray = new THREE.Raycaster( camera.position, vector.sub(camera.position ).normalize() );
        var intersects = ray.intersectObjects( scene.children, true);
        var pointIntersect = intersects[ 0 ].point;
        addCube(pointIntersect.x, pointIntersect.y, pointIntersect.z)
    }