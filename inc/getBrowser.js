const puppeteer = require( 'puppeteer' );

let browser;

const getBrowser = async ( { debug = flase, slowMo = 0 } = {} ) => {
	if ( browser ) {
		return browser;
	}

	browser = await puppeteer.launch( {
		headless: ! debug,
		slowMo: slowMo,
	} );

	return browser;
};

const closeBrowser = async () => {
	browser && await browser.close();
}

module.exports = {
	getBrowser,
	closeBrowser,
}
