const fs = require( 'fs-extra' );
const del = require( 'del' );
const path = require( 'path' );

const compareImages = require( './compareImg' );
const defaultOptions = require( '../defaultOptions' );

class Test {
	constructor( id, options = {} ) {
		this.id = id;
		this.options = {
			...defaultOptions,
			...options,
		}
	}

	async run( image ) {
		await this.setup();
		this.saveTestImage( image );

		if ( ! this.hasReferenceImage() ) {
			this.approve();
			return true;
		}

		const diff = await this.compareImages();
		return !! diff;
	}

	async setup() {
		await del( this.getTestFilePath() );
		await del( this.getDiffFilePath() );
	}

	getTestFilePath() {
		const { base, imgTest } = this.options.directories;
		return path.resolve( process.cwd(), `./${base}/${imgTest}/${this.id}.png` );
	}

	saveTestImage( image ) {
		const path = this.getTestFilePath();
		fs.writeFileSync( path, image );
		return path;
	}

	getRefFilePath() {
		const { base, imgRef } = this.options.directories;
		return path.resolve( process.cwd(), `./${base}/${imgRef}/${this.id}.png` );
	}

	hasReferenceImage() {
		return fs.existsSync( this.getRefFilePath() );
	}

	getDiffFilePath() {
		const { base, imgDiff } = this.options.directories;
		return path.resolve( process.cwd(), `./${base}/${imgDiff}/${this.id}.png` );
	}

	async compareImages() {
		return await compareImages( this.getTestFilePath(), this.getRefFilePath(), this.getDiffFilePath() );
	}

	approve() {
		const testPath = this.getTestFilePath();
		const refPath = this.getRefFilePath();
		const diffPath = this.getDiffFilePath();
		fs.existsSync( testPath ) && fs.copySync( testPath, refPath );
		del( diffPath );
	}
}

module.exports = Test;
