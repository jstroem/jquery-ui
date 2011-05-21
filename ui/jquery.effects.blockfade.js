/*
 * jQuery UI Effects Blockfade @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Blockfade
 *
 * Depends:
 *	jquery.effects.core.js
  *	jquery.effects.split.js
 */
(function( $, undefined ) {

	$.effects.effect.blockfade = function( o ) {
		
		/*Options:
		 * 		random,
		 * 		reverse, 
		 * 		rows, 
		 * 		columns, 
		 * 		duration,
		 * 		interval, 
		 * 		easing,
		 * 		pieces,
		 * 		show
		 */

		return this.queue( function( next ) {
			var el = $( this ),
				opt = $.effects.split.options( el, {
						distance: 1,						
						reverse: false,
						random: false,
						interval: false
					}, o );

			function animate( width, height, interval, duration, row, column, documentCoords, parentCoords, callback ) {
				var random = opt.random ? Math.abs( opt.random ) : 0, 
					el = $( this ),
					randomDelay = Math.random() * ( opt.rows + opt.columns ) * interval, 
					uniformDelay = ( opt.reverse ) ? 
						( ( ( opt.rows + opt.columns ) - ( row + column ) ) * interval ) : 
						( ( row + column ) * interval ), 
					delay = randomDelay * random + Math.max( 1 - random, 0 ) * uniformDelay;
				
				if ( opt.show ) {
					el.css( "opacity", 0 );
				}
						
				el.delay( delay ).animate( { opacity: ( opt.show ? 1 : 0 ) }, duration, opt.easing, callback );
			}

			$.effects.split.startAnim( el, opt, animate, next );
		} );
	}
	
})(jQuery);