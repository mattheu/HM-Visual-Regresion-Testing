const puppeteer = require( 'puppeteer' );

module.exports = async ( url, username, password ) => {
	// Create browser instance, and give it a first tab
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto( url );
	await page.type( '#user_login', username );
	await page.type( '#user_pass', password );
	await page.click( '#wp-submit' );
	await page.waitForNavigation();

	const cookies = await page.cookies();

	await browser.close();

	return cookies;
}
