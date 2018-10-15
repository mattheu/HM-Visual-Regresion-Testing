module.exports = {
	getRefFilePath: ( slug, { base, imgRef } ) => `./${base}/${imgRef}/${ slug }.png`,
	getTestFilePath: ( slug, { base, imgTest } ) => `./${base}/${imgTest}/${ slug }.png`,
	getDiffFilePath: ( slug, { base, imgDiff } ) => `./${base}/${imgDiff}/${ slug }.png`,
};
