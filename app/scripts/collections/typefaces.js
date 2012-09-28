define([
	"app",
	"lodash",
	"backbone",
	"models/typeface",
	"plugins/backbone.paginator"
	// "plugins/underscore.string"
],

function( app, _, Backbone, Typeface, Paginator, _str ){

	// Currently a hack till I figure out how to get
	// underscore.string property imported
	var escapeChars = {
			lt: '<',
			gt: '>',
			quot: '"',
			apos: "'",
			amp: '&'
		},
		reversedEscapeChars = {};

	for(var key in escapeChars){
		reversedEscapeChars[escapeChars[key]] = key;
	};

	var Typefaces = Paginator.clientPager.extend({

		url: 'http://use.edgefonts.net/',
		model : Typeface,

		useLevenshteinPlugin : true,
		paginator_core : {},
		paginator_ui : {
			firstPage : 1,
			currentPage : 1,
			perPage : 10,
			totalPages : 1
		},

		// Used to map Adobe's nomenclature to undertandable names
		variantMap : {
			'n1' : 'Thin',
			'n2' : 'Extra Light',
			'n3' : 'Light',
			'n4' : 'Regular',
			'n5' : 'Medium',
			'n6' : 'Semibold',
			'n7' : 'Bold',
			'n8' : 'Heavy',
			'n9' : 'Black',
			'i1' : 'Thin Italic',
			'i2' : 'Extra Light Italic',
			'i3' : 'Light Italic',
			'i4' : 'Italic',
			'i5' : 'Medium Italic',
			'i6' : 'Semibold Italic',
			'i7' : 'Bold Italic',
			'i8' : 'Heavy Italic',
			'i9' : 'Black Italic'
		},

		initializePagination : function( page ){
			this.totalPages = Math.ceil( (app.bootstrap ? app.bootstrap.length : this.length ) / this.paginator_ui.perPage );
			this.currentPage = page || 1;
			this.pager();
		},

		updatePagination : function( perPage ){
			this.howManyPer( perPage );
			_.extend(this, _.pick( this.info(), _.keys(this.paginator_ui) ) );
		},

		parse : function( response ){
			return response;
		},

		setPreviewText : function( text ){
			var attrs = {
				'preview_text': this.escapeHTML( text )
			};

			this.each(function( typeface ){ typeface.set(attrs); }, this);

			if( this.origModels ){
				_.each( this.origModels, function( typeface ){ typeface.set(attrs); }, this);
			}
		},

		// Stolen from underscore.string for input sanitization
		escapeHTML: function( str ) {
			if (str == null) return '';
			return String(str).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
		}
	});

	return Typefaces;
});
