    //Remove element from scene
    function removeEntity(object) {
        var selectedObject = scene.getObjectByName(object.name);
        selectedObject.parent.remove( selectedObject );
    }