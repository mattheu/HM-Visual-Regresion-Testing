## Example config

```
{
	"options": {
		"concurrentTests": 2,
		"removeSelectors": [
			".hide-me",
		]
	},
	"scenarios": [
		{
			"label": "Home",
			"url": "http://example.com"
		},
		{
			"label": "Single Post",
			"url": "http://example.com/single-post"
			"removeSelectors": [
				".also-hide-me > div"
			]
		},
	],
	"viewports": [
		{
			"label": "Desktop",
			"width": 1400,
			"height": 700
		},
		{
			"label": "Mobile",
			"width": 375,
			"height": 667
		}
	]
}
```
