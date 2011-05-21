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
/*
 * OLD EXPLODE
 */
$.effects.effect.explode = function( o ) {

	return this.queue( function( next ) {

		var rows = o.pieces ? Math.round(Math.sqrt(o.pieces)) : 3,
			cells = rows,
			el = $( this ),
			mode = $.effects.setMode( el, o.mode || 'hide' ),
			show = ( mode == 'show' ),

			// show and then visibility:hidden the element before calculating offset
			offset = el.show().css( 'visibility', 'hidden' ).offset(),

			// width and height of a piece
			width = Math.ceil( el.outerWidth() / cells ),
			height = Math.ceil( el.outerHeight() / rows ),
			pieces = [],

			// loop
			i, j, left, top, mx, my;

		// clone the element for each row and cell.
		for( i = 0; i < rows ; i++ ) { // ===>
			top = offset.top + i * height;
			my = i - ( rows - 1 ) / 2 ;

			for( j = 0; j < cells ; j++ ) { // |||
				left = offset.left + j * width;
				mx = j - ( cells - 1 ) / 2 ;

				// Create a clone of the now hidden main element that will be absolute positioned
				// within a wrapper div off the -left and -top equal to size of our pieces
				el
					.clone()
					.appendTo( 'body' )
					.wrap( '<div></div>' )
					.css({
						position: 'absolute',
						visibility: 'visible',
						left: -j * width,
						top: -i * height
					})

				// select the wrapper - make it overflow: hidden and absolute positioned based on
				// where the original was located +left and +top equal to the size of pieces
					.parent()
					.addClass( 'ui-effects-explode' )
					.css({
						position: 'absolute',
						overflow: 'hidden',
						width: width,
						height: height,
						left: left + ( show ? mx * width : 0 ),
						top: top + ( show ? my * height : 0 ),
						opacity: show ? 0 : 1
					}).animate({
						left: left + ( show ? 0 : mx * width ),
						top: top + ( show ? 0 : my * height ),
						opacity: show ? 1 : 0
					}, o.duration || 500, o.easing, childComplete );
			}
		}

		// children animate complete:
		function childComplete() {
			pieces.push( this );
			if ( pieces.length == rows * cells ) {
				animComplete();
			}
		}

		function animComplete() {
			el.css({
				visibility: 'visible'
			});
			$( pieces ).remove();
			if ( !show ) {
				el.hide();
			}
			if ( $.isFunction( o.complete ) ) {
				o.complete.apply( el[ 0 ] );
			}
			next();
		}
	});

};

/*
 * New EXPLODE
 */
	$.effects.effect.sexplode = function( o ) {
		
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
						left : startProperties.left - parentCoords.left,
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
