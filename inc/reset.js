const del = require( 'del' );

module.exports = directories => {
	[
		`${directories.base}/${directories.imgDiff}`,
		`${directories.base}/${directories.imgTest}`,
		`${directories.base}/${directories.imgRef}`,
	].forEach( dir => del( `${dir}/*.png` ) );
}
