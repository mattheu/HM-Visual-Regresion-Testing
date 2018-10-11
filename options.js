module.exports = {
	directories: {
		base: 'matts-css-regression-reports',
		// base: 'matts-css-regression/matts-css-regression-test-viewer/public/reports',
		imgDiff: 'img-diff',
		imgRef: 'img-ref',
		imgTest: 'img-test',
	},
	testBatchCount: 10,
	cookies: [],
	localStorage: {
		WP_DATA_USER_1: {
			'core/editor': {
				'preferences': {
					'insertUsage': {},
				},
			},
			'core/nux': {
				'preferences': {
					'areTipsEnabled': false,
					'dismissedTips': {},
				},
			},
		},
	},
}
