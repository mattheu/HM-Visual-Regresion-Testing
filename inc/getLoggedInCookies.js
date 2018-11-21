const puppeteer = require( 'puppeteer' );
const { getBrowser } = require( './getBrowser' );

module.exports = async ( { url, user, pass } ) => {
	const browser = await getBrowser();
	const page = await browser.newPage();

	await page.goto( url, { waitUntil: 'networkidle2' } );

	await page.type( '#user_login', user );
	await page.type( '#user_pass', pass );
	await page.click( '#wp-submit' );
	await page.waitForNavigation( { waitUntil: 'networkidle2' } );

	const cookies = await page.cookies();

	await page.close();

	return cookies;
}
