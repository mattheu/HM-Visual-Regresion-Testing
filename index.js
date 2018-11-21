const slugify = require( '@sindresorhus/slugify' );
const util = require('util');

const setup = require( './inc/setupDirectories' );
const getLoggedInCookies = require( './inc/getLoggedInCookies' );
const generateResultsFile = require( './inc/generateResultsFile' );
const generateScreenshot = require( './inc/generateScreenshot' );
const Test = require( './inc/Test' );
const Result = require( './inc/Result' );
const reset = require( './inc/reset' );
const parseOptions = require( './inc/parseOptions' );
const { getBrowser, closeBrowser } = require( './inc/getBrowser' );
const Queue = require( './inc/Queue' );

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
	getBrowser();
	const queue = new Queue( { concurrent: options.concurrentTests } );

	tests.forEach( test => queue.addTask( async ( _test, _options ) => {
		return await runTest( _test, _options )
	}, [ test, options ] ) );

	await queue.run();
	closeBrowser();

	return queue.tasks.map( t => t.result );
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

	// If login credentials provided, log in once.
	if ( options.login ) {
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
