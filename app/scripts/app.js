define([
	// Libraries.
	"jquery",
	"lodash",
	"backbone",

	"plugins/backbone.marionette",
	"models/user_input"
],

function( $, _, Backbone, Marionette, UserInput ) {

	var app = new Marionette.Application();

	app.user = new UserInput();

	return app;

});
