/**
 * Typeface List Item View
 */
define([
	"jquery",
	"lodash",
	"backbone",
	"plugins/backbone.marionette",
	"text!templates/typeface/list_item.tmpl",
	"app"
],

function( $, _, Backbone, Marionette, TypefaceListItemTemplate, app ){

	var TypefacesListView = Marionette.ItemView.extend({

		tagName : 'li',
		className : 'typeface-list-item',
		template : _.template( TypefaceListItemTemplate ),
		activeVariant : 'n4',

		ui : {
			previewText : '.font-preview',
			variants : '.font-variants .btn'
		},

		events : {
			'keypress .font-preview' : 'setPreviewText',
			'focusout .font-preview' : 'setPreviewText',
			'click .font-variants .btn' : 'setTextStyle'
		},

		initialize : function(){

			this.scriptClass = 'typeface-' + this.cid;
			this.$el.addClass( this.scriptClass );

			this.bindTo( this.model, "change", this.render, this );
			this.bindTo( app, "font:start:" + this.model.get('slug'), this.startLoading, this );
			this.bindTo( app, "font:finish:" + this.model.get('slug'), this.finishLoading, this );
		},

		templateHelpers : function(){
			return {
				url : this.model.url(),
				variants : _.pick( this.model.collection.variantMap, this.model.get('fonts') )
			};
		},

		onRender : function(){

			// Load the font if it hasn't been loaded already
			if( ! app.isFontLoaded( this.model.get('slug') ) ){
				app.loadFont( this );
			}else{
				app.addFontStyle( this );
			}
		},

		startLoading : function(){
			this.$el.addClass('loading');
		},

		finishLoading : function(){
			this.$el.removeClass('loading');
		},

		setPreviewText : function( evt ){
			// Set text on return or focusout
			if( evt.keyCode === 13 || evt.type === 'focusout' ){

				this.model.set({ preview_text : this.ui.previewText.text() })

				if( evt.type !== 'focusout' ){
					this.ui.previewText.focusout();
				}

				evt.preventDefault();

				app.tracker.push(['_trackEvent', 'Preview Text', 'Single', this.ui.previewText.text()]);
			}
		},

		setTextStyle : function( evt ){
			evt.preventDefault();

			var $btn = $( evt.target ),
			    id = $btn.data('id'),
			    css = { fontWeight : id.slice(1) + '00' };

			if( id === this.activeVariant )
				return;

			// Follow Edge Font nomenclature for font style
			if( id.slice(0,1).toLowerCase() === 'i' ){
				css.fontStyle = 'italic';
			}else{
				css.fontStyle = 'normal';
			}

			this.ui.previewText.css( css );
			this.ui.variants.removeClass('active');
			$btn.addClass('active');

			this.activeVariant = id;

			app.tracker.push(['_trackEvent', 'Text Style', id, this.model.get('slug')]);
		}
	})

	return TypefacesListView;
});
