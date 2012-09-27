/**
 * Typefaces Module
 */
define([
	"jquery",
	"lodash",
	"backbone",
	"app",
	"models/user_input",
	"collections/typefaces",
	"views/typeface/list"
],

function( $, _, Backbone, app, UserInput, Typefaces, TypefacesListView ){

	return app.module("TypefacesList", function( TypefacesList ){

		// Currently unused. Was using a <style> tag to append new preview font declarations
		// app.addInitializer(function( options ){
		// 	var style = TypefacesList.styles;
		// 	style.type = 'text/css';

		// 	document.getElementsByTagName('head')[0].appendChild(style);
		// });

		app.isFontLoaded = function( slug ){
			return _.detect( TypefacesList.loaded, function( obj ){
				return obj.hasOwnProperty( slug );
			});
		};

		app.loadFont = function( view ){
			var slug = view.model.get('slug'),
			    scriptID = 'script-' + slug,
			    fontURL = view.model.url(),
			    identifier = {},
			    callback = function(){
			    	this.trigger('font:finish:' + slug);
			    };

			identifier[ slug ] = scriptID;

			app.trigger('font:start:' + slug );

			(function(d,t,u,id,cb){
				var g = d.createElement(t),
				    s = d.getElementsByTagName(t)[0];

				g.src = u;
				g.id = id;
				g.onload = _.bind(cb, app);
				s.parentNode.insertBefore(g,s);

			}(document,'script', fontURL, scriptID, callback));

			TypefacesList.loaded.push( identifier );

			this.addFontStyle( view );

			app.tracker.push(['_trackEvent', 'Load Font', slug]);
		}

		app.addFontStyle = function( view ){

			$('.font-preview', view.el).css('fontFamily', view.model.get('slug'));
		}


		_.extend( TypefacesList, {
			loaded : [],
			styles : document.createElement('style'),
			collection : new Typefaces(),
			view : TypefacesListView
		});
	});

});

