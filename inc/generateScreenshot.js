const puppeteer = require( 'puppeteer' );
const options = require( '../options' );

const generateScreenshot = async ( scenario, path ) => {
	const { viewport } = scenario;
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	const { cookies = [], localStorage = {} } = options;

	for ( let i = 0; i < cookies.length; i++ ) {
		await page.setCookie( cookies[ i ] );
	}

	await page.setViewport( {
		width: viewport.width,
		height: viewport.height,
	} );

	await page.goto( scenario.url );

	// await page.evaluate( editorPreferences => {
	// 	localStorage.clear();
	// 	Object.keys( localStorage ).forEach( key => {
	// 		localStorage.setItem( key, JSON.stringify( localStorage[ key ] ) );
	// 	} );
	// }, localStorage );

	await page.screenshot( {
		path,
		fullPage: false,
	} );

	await browser.close();
}

module.exports = generateScreenshot;
