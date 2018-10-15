const slugify = require( '@sindresorhus/slugify' );
const fs = require( 'fs' );
const _ = require( 'lodash' );
const Table = require( 'cli-table' );

const defaultOptions = require( './defaultOptions' );
const setup = require( './inc/setup' );
const files = require( './inc/files' );
const getLoggedInCookies = require( './inc/getLoggedInCookies' );
const compareImages = require( './inc/compareImg' );
const generateResultsFile = require( './inc/generateResultsFile' );
const generateScreenshot = require( './inc/generateScreenshot' );
const Result = require( './inc/Result' );
const reset = require( './inc/reset' );

const runTest = async ( scenario, options ) => {
	console.log( `Running test: ${scenario.label} - ${scenario.viewport.label}` );

	const {
		cookies = [],
		localStorage = {},
		directories,
	} = options;

	const slug = slugify( `${scenario.label}-${scenario.viewport.label}` )
	const referenceImagePath = files.getRefFilePath( slug, directories );
	const testImagePath = files.getTestFilePath( slug, directories );

	if ( fs.existsSync( referenceImagePath ) ) {
		const diffImagePath = files.getDiffFilePath( slug, directories );

		await generateScreenshot( scenario, testImagePath, {
			cookies,
			localStorage,
		} );

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
		await generateScreenshot( scenario, referenceImagePath, {
			cookies,
			localStorage,
		} );

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
const runTests = async ( scenarios, viewports, options ) => {
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
				return await runTest( test, options )
			} catch ( error ) {
				console.log( 'error running test', error );
			}
		 } ) ) );
	}

	// Flatten results to account for batches.
	return _.flatten( results );
}

module.exports.init = async ( { options: userOptions, scenarios, viewports } ) => {
	const options = {
		...defaultOptions,
		...userOptions,
	};

	setup( options );

	// If at least one test requires log in, grab the cookies in preparation.
	if ( options.login && scenarios.find( scenario => scenario.loggedIn ) ) {
		options.cookies = options.cookies.concat( await getLoggedInCookies( options.login ) );
	}

	const results = await runTests( scenarios, viewports, options );

	// Format results.
	const formattedResults = results.map( result => {
		const json = result.toJson();
		json.imgRef.src = json.imgRef.src.replace( `${options.directories.base}/`, '' );
		json.imgTest.src = json.imgTest.src.replace( `${options.directories.base}/`, '' );
		json.imgDiff.src = json.imgDiff.src.replace( `${options.directories.base}/`, '' );
		return json
	} );

	generateResultsFile( formattedResults, options.directories.base );

	const table = new Table( {
		head: [ 'Test Name', 'Status', 'Reference', 'Test', 'Diff' ],
	} );

	console.log( table.toString( results.forEach( result => table.push( Object.values( result.format() ) ) ) ) );
}

module.exports.clearRefImages = async userOptions => {
	const options = {
		...defaultOptions,
		...userOptions,
	};

	reset( options.directories );
}
