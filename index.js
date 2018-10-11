const slugify = require( '@sindresorhus/slugify' );
const fs = require( 'fs' );
const _ = require( 'lodash' );
const Table = require('cli-table');

const options = require( './options' );
const setup = require( './inc/setup' );
const files = require( './inc/files' );
const getLoggedInCookies = require( './inc/getLoggedInCookies' );
const compareImages = require( './inc/compareImg' );
const generateResultsFile = require( './inc/generateResultsFile' );
const generateScreenshot = require( './inc/generateScreenshot' );
const Result = require( './inc/Result' );

const viewports = [
	{
		'label': 'mobile',
		'width': 320,
		'height': 480,
	},
	{
		'label': 'laptop',
		'width': 1400,
		'height': 900,
	},
];

const scenarios = [
	{
		label: 'Home',
		url: 'http://localhost:8282',
		loggedIn: true,
	},
	{
		label: 'Post Select Browse',
		url: 'http://localhost:8282/wp/wp-admin/post.php?post=35&action=edit',
		loggedIn: true,
	},
];

const runTest = async scenario => {
	const slug = slugify( `${scenario.label}-${scenario.viewport.label}` );

	const referenceImagePath = files.getRefFilePath( slug );
	const testImagePath = files.getTestFilePath( slug );

	if ( fs.existsSync( referenceImagePath ) ) {
		const diffImagePath = files.getDiffFilePath( slug );

		await generateScreenshot( scenario, testImagePath );

		const isMatch = await compareImages( testImagePath, referenceImagePath, diffImagePath );

		return new Result( {
			scenario,
			slug,
			status: isMatch ? 'ok' : 'fail',
			imgRef: referenceImagePath,
			imgTest: testImagePath,
			imgDiff: diffImagePath,
		} );
	} else {
		await generateScreenshot( scenario, referenceImagePath );
		return new Result( {
			scenario,
			slug,
			status: 'new',
			imgRef: referenceImagePath,
			imgTest: testImagePath,
		} );
	}
}

/**
 * Run tests.
 *
 * Tests are run concurrently.
 * But in batches of opt.testBatchCount
 *
 * @param {*} scenarios
 * @param {*} viewports
 */
const runTests = async ( scenarios, viewports ) => {
	const tests = [];

	// Combine scenarios and viewports into flat tests array.
	scenarios.forEach( scenario => {
		viewports.forEach( viewport => {
			tests.push( {
				...scenario,
				viewport,
			} )
		} );
	} );

	// Chunk up tests to run in batches.
	// Results will be added to results array (but in batches)
	const results = [];
	const batches = _.chunk( tests, options.testBatchCount );

	for ( let i = 0; i < batches.length; i++ ) {
		results.push( await Promise.all( batches[ i ].map( async test => {
			try {
				return await runTest( test )
			} catch ( error ) {
				console.log( 'error running test', error );
			}
		 } ) ) );
	}

	// Flatten results to account for batches.
	return _.flatten( results );
}

const init = async () => {
	setup();

	// If at least one test requires log in, grab the cookies in preparation.
	if ( scenarios.find( scenario => scenario.loggedIn ) ) {
		options.cookies = options.cookies.concat( await getLoggedInCookies( 'http://localhost:8282/wp/wp-login.php', 'matt', 'password' ) );
	}

	const results = await runTests( scenarios, viewports );

	generateResultsFile( results.map( result => result.toJson() ) );

	const table = new Table( {
		head: ['Test Name', 'Status', 'Reference', 'Test', 'Diff' ],
	} );

	console.log( table.toString( results.forEach( result => table.push( Array.values( result.format() ) ) ) ) );
}

init();
