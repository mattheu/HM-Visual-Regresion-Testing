const fs = require( 'fs' );
const pixelmatch = require( 'pixelmatch' );
const PNG = require( 'pngjs' ).PNG;
const readPNG = require( './readPng' );

module.exports = async ( img1Path, img2Path, diffPath ) => {
	return new Promise( async resolve => {
		Promise.all( [
			await readPNG( img1Path ),
			await readPNG( img2Path ),
		] ).then( ( [ img1, img2 ] ) => {
			const imgDiff = new PNG( {
				width: img1.width,
				height: img1.height,
			} );

			const isMatch = ! pixelmatch( img1.data, img2.data, imgDiff.data, img1.width, img1.height, { threshold: 0.3 } );

			if ( ! isMatch ) {
				imgDiff.pack().pipe( fs.createWriteStream( diffPath ) );
			}

			resolve( isMatch );
		} ).catch( e => {
			console.log( 'errorr' );
			console.log( e );
		});
	});
}
