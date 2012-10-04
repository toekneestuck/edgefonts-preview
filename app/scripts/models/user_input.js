define([
	"lodash",
	"backbone"
],

function( _, Backbone){

	var UserInput = Backbone.Model.extend({

		defaults : {
			page: 1,
			per_page : 10,
			filter : null,
			sort : {attr:'name', dir:'asc'},
			preview_text : 'The quick brown fox jumped over the lazy dog',
			query : '',
			show_favorites : false
		},

		initialize : function(){

		},

		showingFavorites : function(){
			return this.get('show_favorites');
		}
	});

	return UserInput;
});
