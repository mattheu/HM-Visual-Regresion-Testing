const fs = require( 'fs' );
const PNG = require( 'pngjs' ).PNG;

module.exports = imgPath => {
	return new Promise( ( resolve, reject ) => {
		if ( ! fs.existsSync( imgPath ) ) {
			reject( `Image does not exist: ${imgPath}` );
		}

		const img = fs.createReadStream( imgPath ).pipe( new PNG() );
		img.on( 'parsed', () => resolve( img ) );
	} );
};
