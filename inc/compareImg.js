const fs = require( 'fs' );
const pixelmatch = require( 'pixelmatch' );
const PNG = require( 'pngjs' ).PNG;
// const util  = require( 'util' );

const readPNG = imgPath => {
	return new Promise( ( resolve, reject ) => {
		if ( ! fs.existsSync( imgPath ) ) {
			reject( `Image does not exist: ${imgPath}` );
		}

		const img = fs.createReadStream( imgPath ).pipe( new PNG() );
		img.on( 'parsed', () => resolve( img ) );
	} );
};

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

			const isMatch = ! pixelmatch( img1.data, img2.data, imgDiff.data, img1.width, img1.height, { threshold: 0.2 } );

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
