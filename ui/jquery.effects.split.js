/*
 * jQuery UI Effects Explode @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Split (Not yet!)
 *
 * Depends:
 *  jquery.effects.core.js
 * 
 */

(function( $, undefined ) {
	//Creating object for helper functions
	$.effects.split = {
		//Helper function to control the split on each animation
		startAnim: function(el, o, animation, next){
		
			//Support for pieces
			if ((!o.rows || !o.columns) && o.pieces) {
				o.rows = o.columns = Math.round(Math.sqrt(o.pieces));
			}
			else {
				o.rows = o.rows || 3;
				o.columns = o.columns || 3;
			}
			
			var interval = o.interval, duration = o.duration - (o.rows + o.columns) * interval, 
				pieceCounter = [], 
				documentCoords = {
					height: $(document).height(),
					width: $(document).width()
				},
				parentCoords, container, i, j, pieces, properties, width, height, firstEl;
			
			$.effects.save(el, ["visibility", "opacity"]);
			
			parentCoords = el.show().css("visibility", "hidden").offset();
			parentCoords.width = el.outerWidth();
			parentCoords.height = el.outerHeight();
			
			if (interval === false) {
				interval = o.duration / (o.rows + o.columns * 2);
			}
			
			//split into pieces
			pieces = $.effects.split.piecer(el, o);
			firstEl = $(pieces[0]);
			container = firstEl.parent().addClass("ui-effects-split");
			width = firstEl.outerWidth();
			height = firstEl.outerHeight();
			
			container.css("overflow", o.crop ? "hidden" : "visible");
			
			//Make animation
			for (i = 0; i < o.rows; i++) {
				for (j = 0; j < o.columns; j++) {
					// call the animation for each piece.
					animation.call(pieces[i * o.columns + j], width, height, interval, duration, i, j, documentCoords, parentCoords, childComplete);
				}
			}
			
			// children animate complete
			function childComplete(){
				pieceCounter.push(this);
				if (pieceCounter.length === o.rows * o.columns) {
					animComplete();
				}
			}
			
			function animComplete(){
				// Ensures that the element is hidden/shown correctly
				$.effects.restore(el, ["visibility", "opacity"]);
				
				if (o.show) {
					el.show();
				}
				else {
					el.hide();
				}
				
				container.remove();
				
				if ($.isFunction(o.complete)) {
					o.complete.apply(el[0]);
				}
				next();
			}
		},
		
		//Intern function for setting up standard options
		options: function( el, defaults, o ) {
			var opt = $.extend( defaults, o );
			//Reverse it if it is hidden and mode is toggle
			if ( el.is( ":hidden" ) && opt.mode === "toggle" ) {
				opt.reverse = !opt.reverse;
			}
	
			//Sets mode for toggle
			opt.mode = $.effects.setMode( el, opt.mode );
			opt.show = opt.mode === "show";
			
			return opt;
		},
		
		/*
		 * Options
		 * 	rows
		 * 	columns
		 * 	pieces
		 */
		piecer: function( el, o ){
			
			//Support pieces
			if ( ( !o.rows || !o.columns ) && o.pieces ) {
				o.rows = o.columns = Math.round( Math.sqrt( o.pieces ) );
			} else {
				o.rows = o.rows || 3;
				o.columns = o.columns || 3;
			}
			
			var height = el.outerHeight(), 
				width = el.outerWidth(), 
				position = el.offset(),
				pieceHeight = Math.ceil( height / o.rows ), 
				pieceWidth = Math.ceil( width / o.columns ), 
				container = $( "<div></div>" ).css({
					position : "absolute",
					padding : 0,
					margin : 0,
					border : 0,
					top : position.top + "px",
					left : position.left + "px",
					height : height + "px",
					width : width + "px",
					zIndex : el.css( "zIndex" )
				}).appendTo( "body" ),
				pieces = [],
				left, top;
	
			for( top = 0; top < height; top += pieceHeight ){
				for( left = 0; left < width; left += pieceWidth ){
					pieces.push(
							el
							.clone()
							.css({
								position: "absolute",
								visibility: "visible",
								top : -top + "px",
								left : -left + "px"
							})
							.wrap( "<div></div>" )
							.parent()
							.css({
								position : "absolute",
								padding : 0,
								margin : 0,
								border : 0,
								height : pieceHeight + "px",
								width : pieceWidth + "px",
								left: left + "px",
								top: top + "px",
								overflow : "hidden"
							}).appendTo( container )
					);
				}
			}
	
			el.hide();
	
			return pieces;
		},
		
	};
})( jQuery );