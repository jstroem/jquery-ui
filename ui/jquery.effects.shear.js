/*
 * jQuery UI Effects Shear @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Shear
 *
 * Depends:
 *	jquery.effects.core.js
  *	jquery.effects.split.js
 */
(function( $, undefined ) {

	$.effects.effect.shear = function( o, done ) {
		/*Options:
		 * 		random,
		 * 		reverse, 
		 * 		distance, 
		 * 		rows, 
		 * 		columns, 
		 * 		duration, 
		 * 		interval, 
		 * 		easing,
		 * 		pieces,
		 * 		fade, 
		 * 		show,
		 * 		crop
		 */
	
		var el = $( this ),
			opt = $.effects.split.options( el, {
					distance: 1,
					reverse: false,
					random: false,
					interval: false,
					fade: true,
					crop: false
				}, o );

		function animate( width, height, interval, duration, row, column, documentCoords, parentCoords, callback ) {
			var random = opt.random ? Math.abs( opt.random ) : 0, 
				el = $( this ),
				randomDelay = Math.random() * ( opt.rows + opt.columns ) * interval, 
				uniformDelay = ( opt.reverse ) ? 
					( ( ( opt.rows + opt.columns ) - ( row + column ) ) * interval ) : 
					( ( row + column ) * interval ), 
				delay = randomDelay * random + Math.max( 1 - random, 0 ) * uniformDelay, 
				startProperties = el.offset(),
				rowOdd = !( row % 2 ),
				colOdd = !( column % 2 ),
				properties, top, left;
			startProperties = {
					top : startProperties.top - parentCoords.top,
					left : startProperties.left - parentCoords.left,
					width : width,
					height : height
			};

			//Copy object
			properties = $.extend( {}, startProperties );

			// If we have only rows or columns, ignore the other dimension
			if ( opt.columns === 1 ) {
				colOdd = rowOdd;
			} else if ( opt.rows === 1 ) {
				rowOdd = !colOdd;
			}

			if ( opt.fade ) {
				properties.opacity = 0;
				startProperties.opacity = 1;
			}

			if ( colOdd === rowOdd ) {
				if ( !colOdd ) {
					properties.left -= opt.distance * parentCoords.width;
				} else {
					properties.left += opt.distance * parentCoords.width;
				}
			} else {
				if ( !colOdd ){
					properties.top -= opt.distance * parentCoords.height;
				} else {
					properties.top += opt.distance * parentCoords.height;
				}
			}
			
			if ( opt.show ) {
				el.css( properties );
				properties = startProperties;
			}

			el.delay( delay ).animate( properties, duration, opt.easing, callback );
		}

		$.effects.split.startAnim( el, opt, animate, done );
	}
	
})(jQuery);