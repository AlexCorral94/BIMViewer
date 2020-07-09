   //Load customized Json file
   function loadModel() {
    var loader = new THREE.ObjectLoader();
    loader.load(modelLocation,
        function (model) {
        model.castShadow = true;
        
        model.scale.set( 0.1, 0.1, 0.1 );

        //Adjust the camera location to the max bouding from object
        var bbox = new THREE.Box3().setFromObject(model);
        var maxObjectDistance = Math.max(bbox.max.z, bbox.max.x, bbox.max.y);
        camera.position.z = maxObjectDistance
        camera.position.x = bbox.max.x;
        camera.position.y = bbox.max.y;

        //Adjust the camera near plane and max/min zoom for controls
        var averageSizes = ((bbox.max.z + bbox.max.x +  bbox.max.y)/3)*0.01;
        camera.near = averageSizes;
        controls.minDistance = averageSizes*1.2;
        controls.maxDistance = maxObjectDistance*4;
        camera.updateProjectionMatrix();
        
        scene.add(model);         
    });     
}