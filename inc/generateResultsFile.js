const fs = require( 'fs' );

module.exports = async ( results, baseDir ) => {
	const file = `${baseDir}/results.json`;
	return new Promise( resolve => fs.writeFile( file, JSON.stringify( results, null, 2 ), 'utf8', () => resolve() ) );
};
