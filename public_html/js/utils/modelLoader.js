// I expect use this as low-levelfunction.
// example model lies in `pkg = 'example_pkg', model = 'sizes'`
define(function(require) {
	var THREE = require('three');
    require('OBJLoader');
    require('MTLLoader');
	
    var objLoader = new THREE.MTLLoader();
    var mtlLoader = new THREE.OBJLoader();
    
	var modelLoader = {
		resourcePath: 'media/game/models/',
		
		getModel: function(pkg, model) {
			var model;
			
			var emptyFunc = function () {};
			mtlLoader.setBaseUrl( resourcePath + pkg + '/' );
			mtlLoader.setPath( resourcePath + pkg + '/' );
			mtlLoader.load( model + '.mtl', 
				function( materials ) 
				{
					materials.preload();
					objLoader.setMaterials( materials );
					objLoader.setPath( resourcePath + pkg + '/' );
					objLoader.load( + '.obj', function ( object ) {
						console.log(object);
						model = object;
					}, emptyFunc, emptyFunc );
				})
			return model;
		},
	};
	
    return wsApi;
});