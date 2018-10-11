const fs = require( 'fs' );
const options = require( '../options' );

module.exports = async results => {
	const file = `${options.directories.base}/results.json`;
	return new Promise( resolve => fs.writeFile( file, JSON.stringify( results, null, 2 ), 'utf8', () => resolve() ) );
};
