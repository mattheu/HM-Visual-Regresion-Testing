const puppeteer = require( 'puppeteer' );

module.exports = async ( { url, user, pass } ) => {
	// Create browser instance, and give it a first tab
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto( url );
	await page.type( '#user_login', user );
	await page.type( '#user_pass', pass );
	await page.click( '#wp-submit' );
	await page.waitForNavigation();

	const cookies = await page.cookies();

	await browser.close();

	return cookies;
}
