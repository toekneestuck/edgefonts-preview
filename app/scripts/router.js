define([
	// Application.
	"app",
	"require",

	// Plugins
	"backbone",
	"plugins/backbone.marionette",

	// Application Modules
	"modules/typefaces_list"
],

function( app, require, Backbone, Marionette ) {

	var Router = Marionette.AppRouter.extend({

		routes: {
			"": "index",
			"page/:num" : 'index'
		},

		index : function( num ){
			var typefaces = require("modules/typefaces_list");

			if( !app.main && _.isUndefined(num) ){
				// Enable bootstrapping
				typefaces.collection.reset( app.bootstrap || [] );
				typefaces.collection.initializePagination();
				typefaces.list = typefaces.list || new typefaces.view({
					model : app.user,
					collection: typefaces.collection
				});

			}else{
				typefaces.collection.goTo( num || 1 );
				app.tracker.push(['_trackEvent', 'Pagination', num]);
			}

			if( !app.main ){
				app.addRegions({
					main: '#dirty-business'
				});
				app.main.show( typefaces.list );
			}
		}
	});

	return Router;

});
