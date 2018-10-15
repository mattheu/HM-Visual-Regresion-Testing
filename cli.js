#!/usr/bin/env node

const fs = require( 'fs' );
const hmTester = require( './index' );

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
	}, function ( argv ) {
		const options = readConfigFile( argv.config );
		hmTester.init( options );
	} )
	.command( 'reset', 'Reset tests', yargs => {
		yargs.positional( 'config', {
			type: 'string',
			describe: 'Relative path to config file.',
		} );
	}, function ( argv ) {
		const options = readConfigFile( argv.config );
		hmTester.clearRefImages( options );
	} )
	.help()
	.argv
