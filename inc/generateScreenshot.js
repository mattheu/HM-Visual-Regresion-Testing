const puppeteer = require( 'puppeteer' );
const { getBrowser } = require( './getBrowser' );

const launchPuppeteer = async () => {
	const browser = await getBrowser();
	const page = await browser.newPage();

	return {
		browser,
		page,
	}
};

const pageSetViewport = async ( page, viewport ) => {
	return await page.setViewport( {
		width: viewport.width,
		height: viewport.height,
	} );
}

const pageSetCookies = async ( page, cookies ) => {
	for ( let i = 0; i < cookies.length; i++ ) {
		await page.setCookie( cookies[ i ] );
	}
}

const pageSetLocalStorage = async ( page, localStorage ) => {
	if ( ! localStorage || Object.values( localStorage ).length < 1 ) {
		return;
	}

	await page.evaluate( toStore => {
		localStorage.clear();
		Object.keys( toStore ).forEach( key => {
			toStore.setItem( key, JSON.stringify( toStore[ key ] ) );
		} );
	}, localStorage );
	await page.reload();
}

const pageRemoveSelectors = async ( page, removeSelectors ) => {
	if ( ! removeSelectors || removeSelectors.length < 1 ) {
		return;
	}

	await page.evaluate( removeSelectors => {
		removeSelectors.forEach( selector => {
			const els = document.querySelectorAll( selector );
			if ( els && els.length > 0 ) {
				els.forEach( el => el.remove() );
			}
		} )
	}, removeSelectors );
}

const generateScreenshot = async ( scenario, options ) => {
	const { viewport } = scenario;
	const { cookies = [], localStorage = {} } = options;
	const { page } = await launchPuppeteer();

	const removeSelectors = [
		...( options.removeSelectors || [] ),
		...( scenario.removeSelectors || [] ),
	];

	await pageSetViewport( page, viewport );
	await pageSetCookies( page, cookies );

	await page.goto( scenario.url, {
		waitUntil: 'networkidle0',
		timeout: 60000,
	} );

	await pageSetLocalStorage( page, localStorage );
	await page.waitFor( scenario.waitFor || options.waitFor || 0 );
	await pageRemoveSelectors( page, removeSelectors );

	const image = await page.screenshot( { fullPage: true } );
	await page.close();

	return image;
}

module.exports = generateScreenshot;
