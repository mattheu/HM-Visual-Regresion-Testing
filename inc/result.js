class Result {
	constructor( { scenario, slug, status } ) {
		this.scenario = scenario;
		this.slug = slug;
		this.status = status;
	}

	getLabel() {
		return `${this.scenario.label} - ${this.scenario.viewport.label}`;
	}

	toJson() {
		return {
			label: this.getLabel(),
			slug: this.slug,
			status: this.status,
			imgRef: `${this.slug}.png`,
			imgTest: `${this.slug}.png`,
			imgDiff: `${this.slug}.png`,
			viewport: this.scenario.viewport,
			url: this.scenario.url,
		}
	}
}

module.exports = Result;
