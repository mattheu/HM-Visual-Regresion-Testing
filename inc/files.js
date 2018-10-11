const options = require( '../options' );

const {
	base,
	imgRef,
	imgTest,
	imgDiff,
} = options.directories;

module.exports = {
	getRefFilePath: slug => `./${base}/${imgRef}/${ slug }.png`,
	getTestFilePath: slug => `./${base}/${imgTest}/${ slug }.png`,
	getDiffFilePath: slug => `./${base}/${imgDiff}/${ slug }.png`,
};
