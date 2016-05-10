// I expect use this as low-levelfunction.
// example model lies in `pkg = 'example_pkg', name = 'sizes'`
define(function(require) {
	var THREE = require('three');
    require('OBJLoader');
    require('MTLLoader');
	
    var mtlLoader = new THREE.MTLLoader();
    var objLoader = new THREE.OBJLoader();
	var resourcePath = 'media/game/models/';
    
	var modelLoader = {
		
		getModel: function(pkg, name, callback) {
			var result;
			var isLoaded = false;
			var timeoutStarted = new Date().getTime();
			var timeout = 3000; // ms
			
			var emptyFunc = function () {};
			
			mtlLoader.setBaseUrl( resourcePath + pkg + '/' );
			mtlLoader.setPath( resourcePath + pkg + '/' );
			mtlLoader.load( name + '.mtl', 
				function( materials ) 
				{
					materials.preload();
					objLoader.setMaterials( materials );
					objLoader.setPath( resourcePath + pkg + '/' );
					objLoader.load( name + '.obj', function ( object ) {
						result = object;
						callback(object);
					}, emptyFunc, emptyFunc );
				})
		},
		
	};
	
    return modelLoader;
});