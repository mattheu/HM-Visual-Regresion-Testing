const fs = require( 'fs' );
const path = require( 'path' );
const Handlebars = require( 'handlebars' );

module.exports = async ( results, baseDir ) => {
	// Write results JSON file.
	const fileJSON = path.resolve( process.cwd(), `${baseDir}/report.json` )
	await new Promise( resolve => fs.writeFile( fileJSON, JSON.stringify( results, null, 2 ), 'utf8', () => resolve() ) );

	// Write results HTML file.
	const fileHTML = path.resolve( process.cwd(), `${baseDir}/report.html` )
	const template = Handlebars.compile( fs.readFileSync( './report.handlebars', 'utf8' ) );

	await new Promise( resolve => fs.writeFile( fileHTML, template( {
		foo: [
			{ bar: 'a' },
		],
		results,
	} ), 'utf8', () => resolve() ) );

	fs.copyFileSync(
		path.resolve( __dirname + '/../report.css' ),
		path.resolve( process.cwd(), `${baseDir}/report.css` )
	);
};
