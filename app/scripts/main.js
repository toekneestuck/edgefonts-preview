require([
	"jquery",
	"lodash",

	// Application.
	"app",

	// Main Router.
	"router"
],

function($, _, app, Router) {

	this.app = app;

	app.addInitializer(function( options ){
		// Define your master router on the application namespace and trigger all
		// navigation from this instance.
		app.router = new Router();
		app.bootstrap = options.bootstrap;
		app.tracker = options.tracker;

		// Trigger the initial route and enable HTML5 History API support, set the
		// root folder to '/' by default.  Change in app.js.
		Backbone.history.start({ pushState: true, root: options.root });

	});

	$(document).ready(function(){

		// Polyfill for input[type="range"]
		Modernizr.load({
			test : Modernizr.inputtypes.range,
			nope : ['/styles/fd-slider.css','/scripts/plugins/polyfill.fd-slider.js'],
			callback : function(url, result, key){
				if("fdSlider" in window && typeof (fdSlider.onDomReady) != "undefined") {
					try { fdSlider.onDomReady(); } catch(err) {};
				};
			}
		});

		app.start({
			root : window.location.pathname,
			bootstrap : window.bootstrap || [],
			tracker : window._gaq || []
		})
	});

});
