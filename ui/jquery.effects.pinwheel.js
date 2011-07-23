/*
 * jQuery UI Effects Pinwheel @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Pinwheel
 *
 * Depends:
 *	jquery.effects.core.js
  *	jquery.effects.split.js
 */
(function( $, undefined ) {

	$.effects.effect.pinwheel = function( o, done ) {
		
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
		 * 		show
		 */

		var el = $( this ),
			opt = $.effects.split.options( el, {
					distance: 1,
					reverse: false,
					random: false,
					interval: 0,
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
				colOdd = !rowOdd;
			} else if ( opt.rows === 1 ) {
				rowOdd = colOdd;
			}

			if ( opt.fade ) {
				properties.opacity = ( opt.show ? 1 : 0 );
				startProperties.opacity = 1;
			}

			if ( colOdd ) {
				if ( rowOdd ) {
					properties.top = properties.top + height * opt.distance;
				} else {
					properties.left = properties.left + width * opt.distance;
				}
			}

			if ( colOdd != rowOdd ) {
				properties.width = width * ( 1 - opt.distance );
			} else {
				properties.height = height * ( 1 - opt.distance );
			}

			if ( opt.show ) {
				el.css( properties );
				if ( opt.fade ) {
					el.css( "opacity", 0 );
				}
				properties = startProperties;
			}

			el.delay( delay ).animate( properties, duration, opt.easing, callback );
		}

		$.effects.split.startAnim( el, opt, animate, done );
	}
	
})(jQuery);