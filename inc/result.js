const options = require( '../options' );

class Result {
	constructor( { scenario, slug, status, imgRef, imgTest, imgDiff } ) {
		this.scenario = scenario;
		this.slug = slug;
		this.status = status;
		this.imgRef = imgRef;
		this.imgTest = imgTest;
		this.imgDiff = imgDiff;
	}

	isOK() {
		return this.status === 'ok' || this.status === 'new';
	}

	getLabel() {
		return `${this.scenario.label} - ${this.scenario.viewport.label}`;
	}

	toJson() {
		const isOK = this.isOK();
		const width = this.scenario.viewport.width;
		const height = this.scenario.viewport.height;

		return {
			label: this.getLabel(),
			slug: this.slug,
			passed: isOK,
			status: this.status,
			imgRef: {
				src: this.imgRef.replace( `${options.directories.base}/`, '' ),
				width,
				height,
			},
			imgTest: {
				src: this.imgTest.replace( `${options.directories.base}/`, '' ),
				width,
				height,
			},
			imgDiff: {
				src: this.imgDiff.replace( `${options.directories.base}/`, '' ),
				width,
				height,
			},
		}
	}

	format() {
		const isOK = this.isOK();
		return {
			'name': this.getLabel(),
			'status': this.isOK() ? '✅' : '❌',
			'reference': this.imgRef,
			'test': ! isOK ? this.imgTest : '',
			'diff': ! isOK ? this.imgDiff : '',
		}
	}
}

module.exports = Result;
