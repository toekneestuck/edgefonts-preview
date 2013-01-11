Adobe Edge Fonts Preview
=================

One-pager to preview Adobe Edge Fonts. A work in progress. Much documentation of the code is also needed.

Overview
--------

This project is an experiment built using [Yeoman](http://yeoman.io). Other frameworks used include:
* [jQuery](http://jquery.com)
* [Backbone.js](http://documentcloud.github.com/backbone/)
* [Lodash](http://lodash.com)
* [Backbone.Marionette](https://github.com/marionettejs/backbone.marionette)
* [Backbone.Paginator](https://github.com/addyosmani/backbone.paginator)
* [Require.js](http://requirejs.org)
* [Compass](http://compass-style.org)

This is my first time using Yeoman, RequireJS, Backbone.Marionette, and Backbone.Paginator. There are likely things I'm doing wrong. Please tell me about them.


### API Endpoint ###

Since Adobe has no way for users to access the fonts other than the EdgeFonts homepage, I created a simple API endpoint to make it easy for anyone to pull the whole list of fonts in JSON format and play:

* [edgefonts.toekneestuck.com/api/fonts.json](http://edgefonts.toekneestuck.com/api/fonts.json)
* And in case you want the font variant mapping: [edgefonts.toekneestuck.com/api/variant_map.json](http://edgefonts.toekneestuck.com/api/variant_map.json)

### JSONifying the fonts from [EdgeFonts.com](http://edgefonts.com) ###

In case you don't want to use the API, the following code block is the small set of commands I run in the WebKit inspector to scrape all of the fonts from the Edge Fonts website into something usable:

```javascript
var tables = $$('table'),
    fonts = [],
    length = tables.length;

for(var i=0; i<length; i++){
    var table = tables.item(i),
        name = table.querySelector('th').innerText,
        slug = table.querySelector('code').innerText,
        weightRows = table.querySelectorAll('tbody tr'),
        variations = [];

    for(var k=0, lr=weightRows.length; k<lr; k++){
        variations.push( weightRows.item(k).querySelector('code').innerText ); 
    }

    fonts.push({name:name,slug:slug,fonts:variations});
}

JSON.stringify(fonts);
```