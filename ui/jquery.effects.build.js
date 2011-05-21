/*
 * jQuery UI Effects Build @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Build
 *
 * Depends:
 *	jquery.effects.core.js
  *	jquery.effects.split.js
 */
(function( $, undefined ) {

	$.effects.effect.build = function( o ){
		/*Options:
		 * 		random,
		 * 		reverse, 
		 * 		distance, 
		 * 		rows, 
		 * 		columns, 
		 * 		direction, 
		 * 		duration, 
		 * 		interval, 
		 * 		easing, 
		 * 		crop, 
		 * 		pieces,
		 * 		fade, 
		 * 		show
		 */

		return this.queue( function( next ) {
	
			var el = $( this ),
				opt = $.effects.split.options( el, {
						direction: "bottom",
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
					uniformDelay = ( opt.reverse || opt.distance < 0 ) ? 
							( ( row + column ) * interval ) : 
							( ( ( opt.rows + opt.columns ) - ( row + column ) ) * interval ), 
					delay = randomDelay * random + Math.max( 1 - random, 0 ) * uniformDelay, 
					properties = el.offset(),   
					maxTop = documentCoords.height - height,
					maxLeft = documentCoords.width - width,
					top, left;

				properties.top -= parentCoords.top;
				properties.left -= parentCoords.left;

				if ( opt.fade ) {
					properties.opacity = ( opt.show ? 1 : 0 );
					el.css( "opacity", opt.show ? 0 : "" );
				}


				if ( opt.direction.indexOf( "bottom" ) !== -1 ) {
					top = properties.top + parentCoords.height * opt.distance;
					top = top > maxTop ? maxTop : top;
				} else if ( opt.direction.indexOf( "top" ) !== -1 ) {
					top = properties.top - parentCoords.height * opt.distance;
					top = top < 0 ? 0 : top;
				}

				if ( opt.direction.indexOf( "right" ) !== -1 ) {
					left = properties.left + parentCoords.width * opt.distance;
					left = left > maxLeft ? maxLeft : left;
				} else if ( opt.direction.indexOf( "left" ) !== -1 ) {
					left = properties.left - parentCoords.width * opt.distance;
					left = left < 0 ? 0 : left;
				}

				if ( opt.direction.indexOf( "right" ) || opt.direction.indexOf( "left" ) ) {
					if ( opt.show ) {
						el.css( "left", left );
					} else {
						properties.left = left;
					}
				}

				if ( opt.direction.indexOf( "top" ) || opt.direction.indexOf( "bottom" ) ) {
					if ( opt.show ) {
						el.css( "top", top );
					} else {
						properties.top = top;
					}
				}

				el.delay( delay ).animate( properties, duration, opt.easing, callback );
			}
			
			$.effects.split.startAnim( el, opt, animate, next );
			
		} );

	}

})(jQuery);
