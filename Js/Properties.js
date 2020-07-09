function addControlGui() {

    var gui = new dat.GUI();
    var f1 = gui.addFolder('Configuration');
    var params = {
                intensity: spotLight.intensity,
            };
    f1.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {
                spotLight.intensity = val;
                render();
            } );
  
    gui1_X = gui.add(Object3D, 'Name').listen();
}