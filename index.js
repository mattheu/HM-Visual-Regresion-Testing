const slugify = require( '@sindresorhus/slugify' );
const _ = require( 'lodash' );

const setup = require( './inc/setupDirectories' );
const getLoggedInCookies = require( './inc/getLoggedInCookies' );
const generateResultsFile = require( './inc/generateResultsFile' );
const generateScreenshot = require( './inc/generateScreenshot' );
const Test = require( './inc/Test' );
const Result = require( './inc/Result' );
const reset = require( './inc/reset' );
const parseOptions = require( './inc/parseOptions' );

const runTest = async ( scenario, options ) => {
	console.log( `Running test: ${scenario.label} - ${scenario.viewport.label}` );

	const slug = slugify( `${scenario.label} - ${scenario.viewport.label}` );
	const image = await generateScreenshot( scenario, options );
	const test = new Test( slug, options );
	const status =  await test.run( image );

	return new Result( {
		scenario,
		slug,
		status,
	} );
}

/**
 * Prepare Tests.
 *
 * Generate a test for each scenario for each viewport.
 *
 * @param {array} scenarios
 * @param {array} viewports
 * @param {array} Tests
 */
const prepareTests = ( scenarios, viewports ) => {
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

	return tests;
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
const runTests = async ( tests, options ) => {
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

const formatResults = ( results, options ) => {
	return results.map( result => ( {
		...result.toJson(),
		imgRef: `./${options.directories.imgRef}/${result.slug}.png`,
		imgTest: `./${options.directories.imgTest}/${result.slug}.png`,
		imgDiff: `./${options.directories.imgDiff}/${result.slug}.png`,
	} ) );
}

const run = async ( { options: userOptions, scenarios, viewports } ) => {
	const options = parseOptions( userOptions );
	setup( options );

	// If at least one test requires log in, grab the cookies in preparation.
	if ( options.login && scenarios.find( scenario => scenario.loggedIn ) ) {
		options.cookies = options.cookies.concat( await getLoggedInCookies( options.login ) );
	}

	const tests = prepareTests( scenarios, viewports );
	const results = await runTests( tests, options );
	generateResultsFile( formatResults( results, options ), options.directories.base );

	return ! results.find( result => result.status === false );
}

const resetAll = async ( { options: userOptions } ) => {
	const options = parseOptions( userOptions );
	await reset( options.directories );
}

const approveAll = async ( { options: userOptions, scenarios, viewports } ) => {
	const tests = prepareTests( scenarios, viewports );
	const options = parseOptions( userOptions );

	const results = await Promise.all( tests.map( async scenario => {
		const slug = slugify( `${scenario.label} - ${scenario.viewport.label}` );
		const test = new Test( slug, options );
		await test.approve();
		return new Result( {
			scenario,
			slug,
			status: true,
		} );
	} ) );

	generateResultsFile( formatResults( results, options ), options.directories.base );
}

module.exports = {
	run,
	resetAll,
	approveAll,
}
