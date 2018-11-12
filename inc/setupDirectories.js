const fs = require( 'fs' );
const path = require( 'path' );

module.exports = options => {
	const { directories } = options;

	// Create dirs if they don't exist.
	[
		path.resolve( process.cwd(), `${directories.base}` ),
		path.resolve( process.cwd(), `${directories.base}/${directories.imgRef}` ),
		path.resolve( process.cwd(), `${directories.base}/${directories.imgTest}` ),
		path.resolve( process.cwd(), `${directories.base}/${directories.imgDiff}` ),
	].forEach( dir => ! fs.existsSync( dir ) && fs.mkdirSync( dir ) );
}

