const defaultOptions = require( '../defaultOptions' );

module.exports = userOptions => {
	const options = {
		...defaultOptions,
		...userOptions,
	};

	options.directories = {
		...defaultOptions.directories,
		...options.directories,
	}

	return options;
}
