// I expect use this as low-levelfunction.
// example model lies in `pkg = 'example_pkg', model = 'sizes'`
define(function(require) {
	var THREE = require('three');
    require('OBJLoader');
    require('MTLLoader');
	
    var mtlLoader = new THREE.MTLLoader();
    var objLoader = new THREE.OBJLoader();
	var resourcePath = 'media/game/models/';
    
	var modelLoader = {
		getModel: function(pkg, model) {
			var result;
			
			var emptyFunc = function () {};
			mtlLoader.setBaseUrl( resourcePath + pkg + '/' );
			mtlLoader.setPath( resourcePath + pkg + '/' );
			mtlLoader.load( model + '.mtl', 
				function( materials ) 
				{
					materials.preload();
					objLoader.setMaterials( materials );
					objLoader.setPath( resourcePath + pkg + '/' );
					objLoader.load( model + '.obj', function ( object ) {
						result = object;
					}, emptyFunc, emptyFunc );
				})
			return result;
		},
	};
	
    return modelLoader;
});