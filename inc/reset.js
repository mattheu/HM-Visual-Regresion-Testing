const del = require( 'del' );
const path = require( 'path' );

module.exports = async directories => {
	del( path.resolve( process.cwd(), directories.base ) );
	// await  Promise.all( [
	// 	path.resolve( process.cwd(), `${directories.base}/${directories.imgDiff}` ),
	// 	path.resolve( process.cwd(), `${directories.base}/${directories.imgTest}` ),
	// 	path.resolve( process.cwd(), `${directories.base}/${directories.imgRef}` ),
	// ].map( dir => del( dir ) ) );

	// await del( path.resolve( process.cwd(), `${directories.base}/report.html` ) );
	// await del( path.resolve( process.cwd(), `${directories.base}/report.css` ) );
	// await del( path.resolve( process.cwd(), `${directories.base}/report.json` ) );
}
