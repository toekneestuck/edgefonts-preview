// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["main"],

  paths: {
    // JavaScript folders.
    libs: "../scripts/libs",
    plugins: "../scripts/plugins",

    // Libraries.
    jquery: "../scripts/libs/jquery",
    lodash: "../scripts/libs/lodash",
    backbone: "../scripts/libs/backbone"
  },

  shim: {
    jquery: {
      exports: "jQuery"
    },

    // Backbone library depends on lodash and jQuery.
    backbone: {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    },

    "plugins/backbone.marionette" : {
      deps: ["backbone"],
      exports : "Backbone.Marionette"
    },

    "plugins/underscore.string" : {
      deps : ["lodash"]
    },

    "plugins/backbone.paginator" : {
      deps : ["jquery", "backbone"],
      exports : "Backbone.Paginator"
    },

    "plugins/backbone.localStorage" : {
      deps : ["jquery", "backbone", "lodash"],
      exports : "Backbone.LocalStorage"
    },

    "plugins/select2" : {
      deps : ["jquery"],
      exports : "Select2"
    }
  }

});
