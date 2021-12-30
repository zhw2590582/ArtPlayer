---
title: Add select in the controls
sidebar_position: 1
---

Sometimes you need to add a list in the controls, then you can use the `selector` and `onSelect` attribute when adding controls

### Switch subtitle

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'right',
            html: 'Subtitle 01',
            selector: [
                {
                    default: true,
                    html: '<span style="color:red">Subtitle 01</span>',
                    url: '/assets/sample/subtitle.srt?id=1',
                },
                {
                    html: '<span style="color:yellow">Subtitle 02</span>',
                    url: '/assets/sample/subtitle.srt?id=2',
                },
            ],
            onSelect: function (item, $dom) {
                console.info(item, $dom);

                art.subtitle.url = item.url;
                
                return 'You click ' + item.html;
            },
        },
    ],
});
```

### Switch filter

<div className="run-code" data-libs="https://cdn.jsdelivr.net/npm/instagram.css@0.1.4/dist/instagram.min.css">▶ Run Code</div>

```js
var instagramFilters = [
	{
		"html": "1977",
		"class": "filter-1977"
	},
	{
		"html": "Aden",
		"class": "filter-aden"
	},
	{
		"html": "Amaro",
		"class": "filter-amaro"
	},
	{
		"html": "Ashby",
		"class": "filter-ashby"
	},
	{
		"html": "Brannan",
		"class": "filter-brannan"
	},
	{
		"html": "Brooklyn",
		"class": "filter-brooklyn"
	},
	{
		"html": "Charmes",
		"class": "filter-charmes"
	},
	{
		"html": "Clarendon",
		"class": "filter-clarendon"
	},
	{
		"html": "Crema",
		"class": "filter-crema"
	},
	{
		"html": "Dogpatch",
		"class": "filter-dogpatch"
	},
	{
		"html": "Earlybird",
		"class": "filter-earlybird"
	},
	{
		"html": "Gingham",
		"class": "filter-gingham"
	},
	{
		"html": "Ginza",
		"class": "filter-ginza"
	},
	{
		"html": "Hefe",
		"class": "filter-hefe"
	},
	{
		"html": "Helena",
		"class": "filter-helena"
	},
	{
		"html": "Hudson",
		"class": "filter-hudson"
	},
	{
		"html": "Inkwell",
		"class": "filter-inkwell"
	},
	{
		"html": "Kelvin",
		"class": "filter-kelvin"
	},
	{
		"html": "Kuno",
		"class": "filter-juno"
	},
	{
		"html": "Lark",
		"class": "filter-lark"
	},
	{
		"html": "Lo-Fi",
		"class": "filter-lofi"
	},
	{
		"html": "Ludwig",
		"class": "filter-ludwig"
	},
	{
		"html": "Maven",
		"class": "filter-maven"
	},
	{
		"html": "Mayfair",
		"class": "filter-mayfair"
	},
	{
		"html": "Moon",
		"class": "filter-moon"
	},
	{
		"html": "Nashville",
		"class": "filter-nashville"
	},
	{
		"html": "Perpetua",
		"class": "filter-perpetua"
	},
	{
		"html": "Poprocket",
		"class": "filter-poprocket"
	},
	{
		"html": "Reyes",
		"class": "filter-reyes"
	},
	{
		"html": "Rise",
		"class": "filter-rise"
	},
	{
		"html": "Sierra",
		"class": "filter-sierra"
	},
	{
		"html": "Skyline",
		"class": "filter-skyline"
	},
	{
		"html": "Slumber",
		"class": "filter-slumber"
	},
	{
		"html": "Stinson",
		"class": "filter-stinson"
	},
	{
		"html": "Sutro",
		"class": "filter-sutro"
	},
	{
		"html": "Toaster",
		"class": "filter-toaster"
	},
	{
		"html": "Valencia",
		"class": "filter-valencia"
	},
	{
		"html": "Vesper",
		"class": "filter-vesper"
	},
	{
		"html": "Walden",
		"class": "filter-walden"
	},
	{
		"html": "Willow",
		"class": "filter-willow"
	},
	{
		"html": "X-Pro",
		"class": "filter-xpro-ii"
	}
]

var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
	controls: [
		{
			position: 'right',
			html: 'Instagram Filters',
			selector: instagramFilters,
			onSelect: function (item) {
				var classNameReg = /\b$|(\sfilter-.+)/;
				var videoClassName = art.template.$video.className;
				var filterClassName = videoClassName.replace(classNameReg, ' ' + item.class);
				art.template.$video.className = filterClassName;
				console.info(filterClassName);
				return item.html;
			},
		},
	],
});
```