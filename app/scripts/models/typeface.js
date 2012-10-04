define([
	"lodash",
	"backbone"
],

function( _, Backbone){

	var Typeface = Backbone.Model.extend({

		defaults : {
			name : '',
			slug : '',
			fonts : [],
			preview_text : 'The quick brown fox jumped over the lazy dog',
			favorite : false
		},

		url : function(){
			var baseurl = this.collection.url,
			    slug = this.get('slug'),
			    fonts = this.get('fonts').length ? ':' + this.get('fonts').join(',') : '';

			return baseurl + slug + fonts + '.js';
		},

		initialize : function(){
			this.set({ fonts_count : this.get('fonts').length });
		},

		isFavorite : function(){
			return this.get('favorite');
		}
	});

	return Typeface;
});
