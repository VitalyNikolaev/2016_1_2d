// I expect use this as low-levelfunction.
// example model lies in `pkg = 'example_pkg', name = 'sizes'`
define(function(require) {
	var THREE = require('three');
    require('OBJLoader');
    require('MTLLoader');

	var resourcePath = 'media/game/models/';

		
	function getModel (pkg, name, callback) {
		var mtlLoader = new THREE.MTLLoader();
		var objLoader = new THREE.OBJLoader();
			var result;

			mtlLoader.setBaseUrl( resourcePath + pkg + '/' );
			mtlLoader.setPath( resourcePath + pkg + '/' );
			mtlLoader.load( name + '.mtl', function( materials ) {
					materials.preload();
					objLoader.setMaterials( materials );
					objLoader.setPath( resourcePath + pkg + '/' );
					objLoader.load( name + '.obj', function ( object ) {
						result = object;
						object.traverse( function ( child ) {
							if ( child instanceof THREE.Mesh ) {
								child.castShadow = true;
								child.receiveShadow = true;
							}
						});
						callback(object);
					});
				})
		}

    return getModel;
});