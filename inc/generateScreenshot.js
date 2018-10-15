const puppeteer = require( 'puppeteer' );

const generateScreenshot = async ( scenario, path, options ) => {
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

	if ( localStorage && Object.values( localStorage ).length > 0 ) {
		await page.evaluate( editorPreferences => {
			localStorage.clear();
			Object.keys( localStorage ).forEach( key => {
				localStorage.setItem( key, JSON.stringify( localStorage[ key ] ) );
			} );
		}, localStorage );
		await page.reload();
	}

	if ( scenario.removeSelectors && scenario.removeSelectors.length ) {
		await page.evaluate( removeSelectors => {
			removeSelectors.forEach( selector => {
				const els = document.querySelectorAll( selector );
				if ( els ) {
					 els.forEach( el => el.remove() );
				}
			} )
		}, scenario.removeSelectors );
	}

	await page.screenshot( {
		path,
		fullPage: true,
	} );

	await browser.close();
}

module.exports = generateScreenshot;
