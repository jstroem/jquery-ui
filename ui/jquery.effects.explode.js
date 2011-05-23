/*
 * jQuery UI Effects Explode @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Explode
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {
	$.effects.effect.explode = function( o ) {
		
		/*Options:
		 * 		random,
		 * 		reverse, 
		 * 		distance, 
		 * 		rows, 
		 * 		columns, 
		 * 		duration, 
		 * 		sync,
		 * 		easing,
		 * 		pieces,
		 * 		interval,
		 * 		fade, 
		 * 		show,
		 * 		crop
		 */
		
		return this.queue( function( next ) {
			var el = $( this ),
				opt = $.effects.split.options( el, {
						distance: 1,
						reverse: false,
						random: false,
						sync: false,
						interval: false,
						fade: true,
						crop: false
					}, o );

			function animate( width, height, interval, duration, row, column, documentCoords, parentCoords, callback ) {
				var el = $( this ),
					delay = 0,
					startProperties = el.offset(),
					distance = opt.distance,
					randomX = 0, 
					randomY = 0, 
					properties, distanceX, distanceY, distanceXY, seed;
				
				startProperties = {
						top : startProperties.top - parentCoords.top,
						left : startProperties.left - parentCoords.left
				};
				
				//Copy object
				properties = $.extend( {}, startProperties );
				
				if ( opt.fade ) {
					properties.opacity = ( opt.show ? 1 : 0 );
					startProperties.opacity = 1;
				}

				if ( opt.random ) {
					seed = ( Math.random() * opt.random ) + Math.max( 1 - opt.random, 0 );
					distance *= seed;
					duration *= seed;

					// To syncronize, give each piece an appropriate delay so they end together
					if ( opt.sync ) {
						delay = opt.duration - duration;
					}
					randomX = Math.random() - 0.5;
					randomY = Math.random() - 0.5;
				}

				distanceY = ( parentCoords.height - height ) / 2 - height * row;
				distanceX = ( parentCoords.width - width ) / 2 - width * column;
				distanceXY = Math.sqrt( Math.pow( distanceX, 2 ) + Math.pow( distanceY, 2 ) );
				properties.top -= distanceY * distance + distanceXY * randomY;
				properties.left -= distanceX * distance + distanceXY * randomX;				
				
				if ( opt.show ) {
					el.css( properties );
					if ( opt.fade ) {
						el.css( "opacity", 0 );
					}
					properties = startProperties;
				}

				el.delay( delay ).animate( properties, duration, opt.easing, callback );
			}

			$.effects.split.startAnim( el, opt, animate, next );
		} );
	}

})(jQuery);
