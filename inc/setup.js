const fs = require( 'fs' );
const del = require( 'del' );

module.exports = options => {
	const { directories } = options;

	// Create dirs if they don't exist.
	[
		`${directories.base}`,
		`${directories.base}/${directories.imgRef}`,
		`${directories.base}/${directories.imgTest}`,
		`${directories.base}/${directories.imgDiff}`,
	].forEach( dir => ! fs.existsSync( dir ) && fs.mkdirSync( dir ) );

	// Remove all previous diff and test files.
	[
		`${directories.base}/${directories.imgTest}`,
		`${directories.base}/${directories.imgDiff}`,
	].forEach( dir => del( `${dir}/*.png` ) );
}

