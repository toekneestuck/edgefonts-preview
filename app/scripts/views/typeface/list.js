/**
 * Typeface List View
 */
define([
	"jquery",
	"lodash",
	"backbone",
	"plugins/backbone.marionette",
	"models/user_input",
	"text!templates/typeface/list.tmpl",
	"views/typeface/list_item",
	"app"
],

function( $, _, Backbone, Marionette, UserInput, TypefaceListTemplate, TypefaceListItemView, app ){

	var TypefacesListView = Marionette.CompositeView.extend({

		className : 'typeface-list',
		template : _.template( TypefaceListTemplate ),

		itemView : TypefaceListItemView,
		itemViewContainer : '#font-list',

		ui : {
			nav : '#nav',
			previewText : '#preview-text-input',
			previewTextBtn : '#preview-text-btn',
			perPageInput : '#preview-per-page',
			perPageBtn : '#preview-per-page-btn'
		},

		events : {
			'click #nav a' : 'goToPage',
			'keypress #preview-text-input' : 'setPreviewText',
			'click #preview-text-btn' : 'setPreviewText',
			'click #preview-per-page-btn' : 'setPreviewsPerPage',
			'keypress #preview-per-page' : 'setPreviewsPerPage'
		},

		initialize : function(){
			this.bindTo( this.model, 'change', this.updateSettings, this );
		},

		updateSettings : function( model, attrs ){
			if( model.hasChanged('per_page') ){
				var value = model.get('per_page');
				this.ui.perPageInput.val( value );
				this.collection.updatePagination( value );

				// !TODO: I shouldn't have to force a re-render of the
				// entire CompositeView
				this.render();
			}

			if( model.hasChanged('preview_text') ){
				var value = model.get('preview_text');
				this.ui.previewText.val( value );
				this.collection.setPreviewText( value );
			}
		},

		onRender : function(){
			this.buildNavigation();
		},

		/**
		 * Build the navigation view
		 */
		buildNavigation : function(){
			var length = this.collection.totalPages,
				current = this.collection.currentPage
			    $container = $('<ul/>');

			for( i=1; i<=length; i++){
				$container.append(
					$('<li/>', {"data-page" : i})
						.html( $('<a/>', {
							href: '/page/'+i,
							class: current == i ? 'active' : ''
						}).text( i ) )
				);
			}

			this.ui.nav.html( $container.html() );
		},

		goToPage : function( evt ){
			var page = $(evt.target).attr('href');

			app.router.navigate(page, {trigger:true});
			evt.preventDefault();
		},

		setPreviewText : function( evt ){

			if( evt.keyCode === 13 || _.indexOf(["focusout", "click"], evt.type) !== -1 ){
				var text = this.ui.previewText.val() || this.ui.previewText.text();

				this.model.set({ preview_text : text });

				if( evt.type !== 'focusout' ){
					this.ui.previewText.focusout();
				}

				evt.preventDefault();
				app.tracker.push(['_trackEvent', 'Preview Text', 'Bulk', text]);
			}
		},

		setPreviewsPerPage : function( evt ){
			var newLimit = parseInt( this.ui.perPageInput.val(), 10 );

			if( evt.keyCode === 13 || _.indexOf(["focusout", "click"], evt.type) !== -1 ){

				if( newLimit !== this.collection.perPage ){
					this.model.set({ per_page : newLimit });
				}

				evt.preventDefault();
				app.tracker.push(['_trackEvent', 'Per Page', newLimit]);
			}
		}
	})

	return TypefacesListView;
});
