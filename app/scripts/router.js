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

			if( !app.main ){
				// Enable bootstrapping
				typefaces.collection.reset( app.bootstrap || [] );
				typefaces.collection.initializePagination( num );
				typefaces.list = typefaces.list || new typefaces.view({
					model : app.user,
					collection: typefaces.collection
				});

				app.addRegions({
					main: '#dirty-business'
				});
				app.main.show( typefaces.list );

			}else{
				typefaces.collection.goTo( num || 1 );
			}

			if( num ){
				app.tracker.push(['_trackEvent', 'Pagination', num]);
				app.tracker.push(['_trackPageview']);
			}
		}
	});

	return Router;

});
