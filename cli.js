#!/usr/bin/env node

const fs = require( 'fs' );
const path = require( 'path' );
const hmTester = require( './index' );

const readConfigFile = path => {
	const config = JSON.parse( fs.readFileSync( path, 'utf8' ) );

	const { LOGIN_URL: url, LOGIN_USER: user, LOGIN_PASS: pass } = process.env;
	if ( url && user && pass ) {
		config.options.login = { url, user, pass };
	}

	return config;
}

const loadEnv = name => {
	require('dotenv').config( { path: path.resolve( process.cwd(), name ? `.env-${name}` : '.env' ) } )
}

const commonArgs = yargs => {
	yargs.positional( 'config', {
		type: 'string',
		describe: 'Relative path to config file.',
	} );
	yargs.positional( 'env', {
		type: 'string',
		describe: 'Load environment variables from a different file. e.g. pass \'staging\' to load environment vars from the file \'.env-staging\'.',
	} );
}

const argv = require( 'yargs' )
	.usage( '$0 [args]' )
	.command( 'run', 'Run tests', yargs => {
		commonArgs( yargs );
	}, async function ( argv ) {
		loadEnv( argv.env )
		const config = readConfigFile( argv.config )
		const result = await hmTester.run( config );
		console.log( { result } );
	} )
	.command( 'reset', 'Reset tests', yargs => {
		commonArgs( yargs );
	}, function ( argv ) {
		loadEnv( argv.env )
		const config = readConfigFile( argv.config );
		hmTester.resetAll( config );
		console.log( 'The visual regression tests have been reset.' );
	} )
	.command( 'approve', 'Approve all tests', yargs => {
		commonArgs( yargs );
	}, function ( argv ) {
		loadEnv( argv.env )
		const config = readConfigFile( argv.config );
		hmTester.approveAll( config );
		console.log( 'All tests have been approved.' );
	} )
	.help()
	.argv
