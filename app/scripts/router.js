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

	// !Todo: This should only perform routes, and a controller
	// object should be created to manage the collection/view/etc
	var Router = Marionette.AppRouter.extend({

		routes: {
			"": "index",
			"page/:num" : 'goToPage',
			"favorites" : 'favorites',
			'favorites/page/:num' : 'favorites'
		},

		setup : function(){
			if( app.main ){ return true; }

			var typefaces = require("modules/typefaces_list"),
				favorites = typefaces.collection.localStorage.findAll();

			// Bootstrap the data
			typefaces.collection.reset( app.bootstrap || [], {silent: true} );

			// Update attributes from favorited fonts
			_.each( favorites, function( obj ){
				var model = typefaces.collection.find( function( model ){
					return model.get('slug') === obj.slug;
				});

				if( model ){
					model.set(obj);
				}
			}, this);

			// Setup pagination before rendering
			typefaces.collection.initializePagination();

			typefaces.list = typefaces.list || new typefaces.view({
				model : app.user,
				collection: typefaces.collection
			});

			this.typefaces = typefaces;
			app.addRegions({ main: '#dirty-business' });
			app.main.show( typefaces.list );
		},

		index : function( num ){
			this.setup();
			this.typefaces.collection.goTo( num );
		},

		goToPage : function( num ){
			this.setup();
			this.typefaces.collection.goTo( num || 1 );
			app.tracker.push(['_trackEvent', 'Pagination', num || 1]);
			app.tracker.push(['_trackPageview']);
		},

		favorites : function( page ){
			this.setup();
			this.typefaces.list.viewFavorites( page );
		}
	});

	return Router;

});
