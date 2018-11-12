#!/usr/bin/env node

const fs = require( 'fs' );
const hmTester = require( './index' );
const CLI = require( 'clui' );
const Spinner = CLI.Spinner;

const readConfigFile = path => {
	return JSON.parse( fs.readFileSync( path, 'utf8' ) );
}

const argv = require( 'yargs' )
	.usage( '$0 [args]' )
	.command( 'run', 'Run tests', yargs => {
		yargs.positional( 'config', {
			type: 'string',
			describe: 'Relative path to config file.',
		} );
	}, async function ( argv ) {
		const config = readConfigFile( argv.config );
		const result = await hmTester.run( config );
		console.log( { result } );
	} )
	.command( 'reset', 'Reset tests', yargs => {
		yargs.positional( 'config', {
			type: 'string',
			describe: 'Relative path to config file.',
		} );
	}, function ( argv ) {
		const config = readConfigFile( argv.config );
		hmTester.resetAll( config );
	} )
	.command( 'approve', 'Approve all tests', yargs => {
		yargs.positional( 'config', {
			type: 'string',
			describe: 'Relative path to config file.',
		} );
	}, function ( argv ) {
		const config = readConfigFile( argv.config );
		hmTester.approveAll( config );
	} )
	.help()
	.argv
