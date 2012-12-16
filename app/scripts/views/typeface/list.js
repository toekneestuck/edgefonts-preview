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
	"app",
	"plugins/select2",
	"plugins/bootstrap.tooltip"
],

function( $, _, Backbone, Marionette, UserInput, TypefaceListTemplate, TypefaceListItemView, app, Select2 ){

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
			perPageBtn : '#preview-per-page-btn',
			sortInput : '#preview-sort',
			searchInput : '#search',
			searchBtn : '#search-btn',
			nameFilter : '#name-filter',
			favoritesBtn : '#view-favorites-btn',
			fontSizer : '#font-size-adjuster'
		},

		events : {
			'click #nav a' : 'goToPage',
			'keypress #preview-text-input' : 'setPreviewText',
			'click #preview-text-btn' : 'setPreviewText',
			'click #preview-per-page-btn' : 'setPreviewsPerPage',
			'keypress #preview-per-page' : 'setPreviewsPerPage',
			'change #preview-sort' : 'setSort',
			'change #name-filter' : 'liveFilter',
			'click #view-favorites-btn' : 'toggleFavorites',
			'change #font-size-adjuster' : 'setFontSize'
		},

		initialize : function(){
			this.bindTo( this.model, 'change', this.updateSettings, this );
		},

		updateSettings : function( model, attrs ){
			if( model.hasChanged('per_page') ){
				var num = model.get('per_page');
				this.ui.perPageInput.val( num );
				this.collection.updatePagination( num );

				// !TODO: I shouldn't have to force a re-render of the
				// entire CompositeView
				this.render();
			}

			if( model.hasChanged('preview_text') ){
				var text = model.get('preview_text');
				this.ui.previewText.val( text );
				this.collection.setPreviewText( text );
			}

			if( model.hasChanged('sort') ){
				var sort = model.get('sort');

				this.ui.sortInput.val( [sort.attr,sort.dir].join(',') );

				this.collection.setSort( sort.attr, sort.dir );
			}

			if( model.hasChanged('query') ){

				if( model.get('query').length ){

					this.collection.setFieldFilter([{
						field: 'slug',
						type: 'oneOf',
						value : model.get('query')
					}]);

				}else{
					// NOT WORKING
					this.collection.clearFieldFilter();
				}

				// TODO: This is slow and sucks. Shouldn't have to call these.
				this.collection.updatePagination( model.get('per_page') );
				this.buildNavigation();
			}

			if( model.hasChanged('show_favorites') ){
				var active = model.get('show_favorites');
				this.ui.favoritesBtn
					.html( active ? '&#9733;' : '&#9734;')
					.attr('data-original-title', active ? 'Show All' : 'Show Favorites Only')
					.tooltip('setContent');
			}
		},

		templateHelpers : function(){
			return {
				setSortInput : function( attr, dir ){
					var sort = this.sort;
					if( attr === sort.attr && dir === sort.dir ){
						return ' selected="selected"';
					}
					return '';
				},
				showingFavorites : this.model.showingFavorites()
			};
		},

		onRender : function(){
			this.buildNavigation();
			this.buildFilter();
			this.ui.favoritesBtn.tooltip();
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

		buildFilter : function(){

			if( this.ui.nameFilter.data('select2') ){

				this.ui.nameFilter.select2("val", this.model.get('query'));

			}else{

				this.ui.nameFilter.select2({
					placeholder : 'Choose fonts',
					tags : _.map( this.collection.origModels, function( model ){
						return {
							id : model.get('slug'),
							text: model.get('name')
						};
					}),
					multiple : true,
					closeOnSelect : false,
					val : this.model.get('query')
				});
			}
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
		},

		setSort : function( evt ){
			var value = this.ui.sortInput.val().split(','),
			    attr = value[0],
			    dir = value[1];

			this.model.set({
				sort : {
					attr: attr,
					dir : dir
				}
			});

			app.tracker.push(['_trackEvent', 'Sorting', attr + ', ' + dir]);

			// Do NOT evt.preventDefault() so the change event fires
		},

		setFontSize : function( evt ){
			var value = this.ui.fontSizer.val();

			this.collection.setFontSize( value );
			this.ui.fontSizer.next('output').text( value + 'px' );

			app.tracker.push(['_trackEvent', 'Font Size', value]);
		},

		liveFilter : function( evt ){
			var value = this.ui.nameFilter.val();

			this.model.set({ query : value.length ? value.split(',') : '' });
		},

		toggleFavorites : function( evt ){

			if( this.model.showingFavorites() ){
				this.clearFavorites();
			}else{
				this.viewFavorites();
			}

			evt.preventDefault();
		},

		viewFavorites : function(){
			var favorites = this.collection.where({ favorite : true });
			favorites = _.map( favorites, function( model ){
				return model.get('slug');
			});

			this.model.set({
				query : favorites,
				show_favorites : true
			});
		},

		clearFavorites : function(){
			this.model.set({
				query : this.collection.lastFilterExpression,
				show_favorites : false
			});
		}
	})

	return TypefacesListView;
});
