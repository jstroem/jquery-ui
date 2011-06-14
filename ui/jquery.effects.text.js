/*
 * jQuery UI Effects Text @VERSION
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/..
 *
 * Depends:
  *	jquery.effects.core.js
 *	jquery.effects.text.js
 */
;jQuery.effects.text || (function( $, undefined ) {
	//Extend the $.fn with text methods.
	$.fn.extend({
		textEffect: function( effect, options, speed, callback ) {
			var args = $.effects.normalizeArguments.apply( this, arguments ),
				mode = args.mode,
				effectMethod = $.effects.text[ args.effect ];
			
			if ( $.isFunction( effectMethod ) ) {
				return effectMethod.call( this, args );
			} else {
				return this.each( function() {
					if ( args.callback ) {
						args.callback.call( this );
					}
				});
			}
		},
		
		showText: function( speed ) {
			var args = $.effects.normalizeArguments.apply( this, arguments );
			args.mode = "show";
			return this.textEffect.call( this, args );
		},
	
		hideText: function( speed ) {
			var args = $.effects.normalizeArguments.apply( this, arguments );
			args.mode = "hide";
			return this.textEffect.call( this, args );
		},
	
		toggleText: function( speed ) {
			var args = $.effects.normalizeArguments.apply( this, arguments );
			args.mode = "toggle";
			return this.textEffect.call( this, args );
		}
		
	});
	
	/* options: 
	 *	o.text should be '' if not should be used
	 *	o.words boolean if words or chars 
	 *	o.duration
	 * 	o.reverse
	 */
	function startTextAnim( el, o, animation, next ) {
		/*	The following regular expression courtesy of Phil Haack
			http://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx
		*/
		var tagReg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)/g,
			html = [],
			parentCoords = $.extend( el.offset(), {
				width: el.width(),
				height: el.height()
			} ), 
			replaceWith, reg, i, orgHtml, set, animationLeft, wordCount, duration, interval;
	
		/* Translation: /(HTML tag plus spaces)|(word/letter without '<' plus spaces)/g */
		if ( o.words ) {
			reg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)\s*|([^\s<]+\s*)/g;
		} else {
			reg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)\s*|([^\s<]\s*)/g;
		}

		/* If animation is hiding then take the text from o.text or el.data( 'ui-hidden-text' ) */
		if ( o.show ) {
			orgHtml = o.text || el.data( "ui-hidden-text" ) || "";
			el.html ( o.text || el.data( "ui-hidden-text" ) || "" );
		} else {
			/* If showing then save the html in el.data( 'ui-hidden-text' ) */
			orgHtml = el.html();
			el.data( "ui-hidden-text", el.html( ) );
		}

		/* Set the current text to use */
		o.text = el.html();
	
		/* Get the words */
		words = o.text.match( reg );
	
		/* Loop over the words and seperate them (put 'em in a span) */
		for ( i = 0, l = words.length; i < l; i++ ) {
			var word = words[ i ];
			if ( !word.match( tagReg ) ) {
				html.push( '<span>' + word + '</span>' );
			} else {
				html.push( word );
			}
		}

		/* See how many words there are */
		wordCount = html.length;

		/* No words? halt */
		if ( !wordCount ) {
			return;
		}
	
		/* Put the newer correct html in place */
		el.html( html.join( "" ) );
	
		/* Retrieve the total set of elements */
		set = el.find( "span:not(:has(span))" ).get( );
	
		/* Calculate the duration and interval points */
		interval = ( o.duration / ( 1.5 * wordCount ) );
		duration = ( o.duration - wordCount * interval );
	
		/* If the cycle needs to reverse, reverse it all */
		if ( o.reverse ) {
			set.reverse();
		}		
		
		/* Callback used to check when the animation is finished. */
		animationLeft = set.length;
		
		function childCallback() {
			animationLeft--;
			if ( animationLeft === 0 ) {
				animComplete();
			}
		}
		
		// all child animations are done
		function animComplete() {
			/* internal callback when event has finished, therefor pass object */
			if ( !o.show ) {
				el.empty();
			} else {
				el.removeData( 'ui-hidden-text' );
				el.html( orgHtml );
			}
			
			if ( $.type( o.finished ) === 'function' ) {
				o.finished.call( el );
			}
			
			/* dequeue the shizzle */
			el.dequeue();
			
			if ( $.isFunction( o.complete ) ) {
				o.complete.apply( el[ 0 ] );
			}
			next();
		}
		
		/* Iterate over all the elements run their animation function on it */
		for ( i = 0, l = set.length; i < l; i++ ) {
			var $word = $( set[ i ] );
			/*	Call the animation per element
				This way each method can define it's manipulation per element
			*/
			animation.call( $word, interval, duration, i, wordCount, parentCoords, childCallback );
		}
	
	};
	
	function textOptions( el, o ) {
		var opt = $.extend( {
			easing: 'linear',
			words: true,
			text: false,
			distance: 1, // move element to/from where * parent.height ()
			direction: 'top',
			reverse: false,
			duration: 10,
			random: false,
			wordDelay: 0
		}, o );
		
		opt.mode = $.effects.setMode( el, opt.mode );
		opt.show = opt.mode === "show";
		
		return opt;
	};
	
	$.effects.text = {
		explode: function ( o ) {
			return this.queue( function( next ) {
				var el = $( this ),
					opt = textOptions( o );
			} );
		},
		
		type: function ( o ) {
			return this.queue( function( next ) {
				var el = $( this ),
					opt = textOptions( el, o );
					
				function animate ( interval, duration, i, wordCount, parentCoords, callback ) {
					var el = $( this ),
						delay = opt.show ? 
								( interval * i ) : 
								( wordCount - i - 1 ) * interval,
						randomDelay = 0;
					
					/** TODO: Should the show not be removed here? **/
					if ( opt.random !== false && opt.show ) {
						randomDelay = ( Math.random() * text.length * interval ) * interval;
						
						/* The higher the random % the slower */
						delay = (randomDelay / (2 - opt.random)) + opt.wordDelay;
						opt.wordDelay = delay;
					}
						
					if ( opt.show ) { 
						el.css( 'opacity', 0 ); 
					}
					/** TODO: Should we make a not editable speed like in the examples **/
					el.delay( delay ).animate( { opacity: opt.show }, duration, opt.easing, callback );
				}
				
				startTextAnim( el, opt, animate, next );				
			} );
		},
		
		build: function ( o ) {
			return this.queue( function( next ) {
			} );
		},
		
		blockfade: function ( o ) {
			return this.queue( function( next ) {
				var el = $( this ),
					opt = textOptions( el, o );
				function animate( interval, duration, i, wordCount, parentCoords, callback ){
					var el = $( this ),
						delay = interval * i,
						randomDelay = 0, 
						uniformDelay = 0;
						
					if ( opt.random !== false ) {
						randomDelay = Math.random() * wordCount * interval;
						
						/* If interval or random is negative, start from the bottom instead of top */
						if ( opt.reverse ) {
							uniformDelay = ( wordCount - i ) * interval;
						} else {
							uniformDelay = i * interval; 
						}
		
						delay = randomDelay * opt.random + Math.max( 1 - opt.random, 0 ) * uniformDelay;
					}
		
					/* run it */
					el.delay( delay ).animate( { opacity: opt.show }, duration, opt.easing, callback );
				};
				
				startTextAnim( el, opt, animate, next );	
			} );
		},
		
		
	
	}

/** given from the ported version **/
	
	var defaultOptions = {
		easing: 'linear',
		words: true,
		text: '',
		distance: 1, // move element to/from where * parent.height ()
		direction: 'top',
		reverse: false,
		random: false
	};
	
	$.effects.textExplode = function ( o, show ) {
	
		var docHeight = $( document ).height(),
			docWidth = $( document ).width();
			show = show ? 1 : 0; //show is either 1 or null 
	
		/* Internal callback to run before animation has started */
	
		function beforeAnimate() {
	
			/* Set the current position of the element */
			var $this = this.css(this.offset());
			/*
				Have to find out why this happends,
				just doing this.css ('position', 'absolute') doesn't work >:-[
				So we use this work around
			*/
			setTimeout(
	
			function () {
				$this.css('position', 'absolute');
			}, 10);
	
		}
	
		function finished() {
			this.empty();
		}
	
		o = $.extend({}, defaultOptions, {
			easing: show ? 'easeInSine' : 'easeInCirc'
		}, o, {
			finished: show ? null : finished,
			beforeAnimate: beforeAnimate,
			/* animation function */
			animate: function (interval, duration, i, wordCount, parentCoords) {
	
				/* set some basic stuff */
				var offset = this.offset(),	
					offsetTo = {},
					width = this.outerWidth(),
					height = this.outerHeight(),
					properties = {},
					/* max top */
					mTop = docHeight - height,
					/* max left */
					mLeft = docWidth - width,
					distance = o.distance * 2,
					distanceY, distanceX, distanceXY, properties = {
						opacity: show ? 1 : 0
					},
					_duration = duration,
					randomX = 0,
					randomY = 0,
					delay = 10;
	
				/* Hide or show the element according to what we're going to do */
				this.css({
					opacity: show ? 0 : 1
				});
	
	
				if (o.random !== false) {
					var seed = (Math.random() * o.random) + Math.max(1 - o.random, 0);
	
					distance *= seed;
					duration *= seed;
	
					// To syncronize, give each piece an appropriate delay so they end together
					//delay = ((args.unhide && args.sync) || (!args.unhide && !args.sync)) ? (args.duration - duration) : 0;
					randomX = Math.random() - 0.5;
					randomY = Math.random() - 0.5;
				}
	
				distanceY = ((parentCoords.height - height) / 2 - (offset.top - parentCoords.top));
				distanceX = ((parentCoords.width - width) / 2 - (offset.left - parentCoords.left));
				distanceXY = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
	
				offsetTo.top = offset.top - distanceY * distance + distanceXY * randomY;
				offsetTo.left = offset.left - distanceX * distance + distanceXY * randomX;
	
				if (offsetTo.top > (docHeight - height)) {
					offsetTo.top = docHeight - height;
				} else if (offsetTo.top < 0) {
					offsetTo.top = 0;
				}
	
				if (offsetTo.left > (docWidth - width)) {
					offsetTo.left = docWidth - width;
				} else if (offsetTo.left < 0) {
					offsetTo.left = 0;
				}
	
				if (show) {
					this.css(offsetTo);
					properties.top = offset.top;
					properties.left = offset.left;
	
				} else {
					this.css(offset);
					properties.top = offsetTo.top;
					properties.left = offsetTo.left;
				}
	
				/* run it */
				this.delay(delay).animate(properties, duration, o.easing);
	
	
	
			}
		});
	
		/* Pass everything to the general text engine */
		$.effects.textAnim.call(this, o);
	};
	
	$.effects.textConverge = function (o) {
		$.effects.textExplode.call(this, o, 1);
	};
	
	$.effects.backspace = function (o, show) { /* show is either 1 or null */
		show = show || 0;
	
		/* Internal callback to run when animation has finished */
	
		function finished() {
			this.empty();
		}
	
		/* Internal callback to run before animation has started */
	
		function beforeAnimate() {
			this.css('opacity', 0);
		}
	
		o = $.extend({}, defaultOptions, {
			easing: 'easeInOutSine'
		}, o, {
			words: false,
			wordDelay: 0
		}, {
			finished: show ? null : finished,
			beforeAnimate: show ? beforeAnimate : null,
			animate: function (interval, duration, i, wordCount, parentCoords) {
	
	
				var text = this.text(),
					space = /\s/.test(text),
	
					/* default delay */
					delay = show ? (interval * i) : (wordCount - i - 1) * interval;
	
	/*
						Randomize delay if necessary
						Note, reverse doesn't really matter at this time
					*/
				if (o.random !== false && show) {
					var randomDelay = (Math.random() * text.length * interval) * interval;
	
					/* The higher the random % the slower */
					delay = (randomDelay / (2 - o.random)) + o.wordDelay;
					o.wordDelay = delay;
				}
	
	
				/* run it */
				this.delay(delay).animate({
					opacity: show
				}, 10, o.easing);
			}
		});
	
		/* Pass everything to the general text engine */
		$.effects.textAnim.call(this, o);
	};
	
	
	$.effects.type = function (o) { /* Use the backspace, for redundancy purposes */
		$.effects.backspace.call(this, o, 1);
	};
	
	$.effects.disintegrate = function (o, show) {
	
		var docHeight = $(document).height(),
			docWidth = $(document).width(); /* show is either 1 or null (build or disintegrate) */
		show = show ? 1 : 0;
	
		/* Internal callback to run before animation has started */
	
		function beforeAnimate() {
	
			/* Set the current position of the element */
			var $this = this.css(this.offset());
	/*
				Have to find out why this happends,
				just doing this.css ('position', 'absolute') doesn't work >:-[
				So we use this work around
			*/
			setTimeout(
	
			function () {
				$this.css('position', 'absolute');
			}, 10);
	
		}
	
		function finished() {
			this.empty();
		}
	
		o = $.extend({}, defaultOptions, {
			easing: show ? 'easeInSine' : 'easeInCirc'
		}, o, {
			finished: show ? null : finished,
			beforeAnimate: beforeAnimate,
			/* animation function */
			animate: function (interval, duration, i, wordCount, parentCoords) {
	
				/* set some basic stuff */
				var offset = this.offset(),
					width = this.outerWidth(),
					height = this.outerHeight(),
					properties = {},
					/* max top */
					mTop = docHeight - height,
					/* max left */
					mLeft = docWidth - width;
	
				/* Hide or show the element according to what we're going to do */
				this.css({
					opacity: show ? 0 : 1
				});
	
				var top, left;
				if (show) { /* we're going to build */
					properties.top = offset.top;
					properties.left = offset.left;
					properties.opacity = 1;
					if (o.direction.indexOf('top') !== -1) {
						top = offset.top - parentCoords.height * o.distance;
	
						this.css('top', top < 0 ? 0 : top); // 1 = o.distance
					} else if (o.direction.indexOf('bottom') !== -1) {
						top = offset.top + parentCoords.height * o.distance;
	
						this.css('top', top > mTop ? mTop : top); // 1 = o.distance
					}
	
					if (o.direction.indexOf('left') !== -1) {
						left = offset.left - parentCoords.width * o.distance;
	
						this.css('left', left < 0 ? 0 : left); // 1 = o.distance
					} else if (o.direction.indexOf('right') !== -1) {
						left = offset.left + parentCoords.width * o.distance;
	
						this.css('left', left > mLeft ? mLeft : left); // 1 = o.distance
					}
	
				} else { /* We're going to disintegrate */
					if (o.direction.indexOf('bottom') !== -1) {
						top = offset.top + parentCoords.height * o.distance;
	
						properties.top = top > mTop ? mTop : top; // 1 = o.distance
					} else if (o.direction.indexOf('top') !== -1) {
						var top = offset.top - parentCoords.height * o.distance
	
						properties.top = top < 0 ? 0 : top; // 1 = o.distance
					}
	
					if (o.direction.indexOf('right') !== -1) {
						left = offset.left + parentCoords.width * o.distance;
	
						properties.left = left > mLeft ? mLeft : left; // 1 = o.distance
					} else if (o.direction.indexOf('left') !== -1) {
						left = offset.left - parentCoords.width * o.distance;
	
						properties.left = left < 0 ? 0 : left; // 1 = o.distance
					}
					properties.opacity = 0;
				}
	
				/* default delay */
				var delay = interval * i;
	
	/*
						Randomize delay if necessary
						Note, reverse doesn't really matter at this time
					*/
				if (o.random !== false) {
	
					var randomDelay = Math.random() * wordCount * interval,
						/* If interval or random is negative, start from the bottom instead of top */
						uniformDelay = o.reverse ? ((wordCount - i) * interval) : (i * interval);
	
					delay = randomDelay * o.random + Math.max(1 - o.random, 0) * uniformDelay;
				}
	
	
				/* run it */
				this.delay(delay + 10 /* fixes stuff in chrome*/ ).animate(properties, duration, o.easing);
			}
		});
	
		/* Pass everything to the general text engine */
		$.effects.textAnim.call(this, o);
	};
	
	$.effects.build = function (o) { /* Use the disintegrate, for redundancy purposes */
		$.effects.disintegrate.call(this, o, 1);
	};
	
	$.effects.blockFadeOut = function (o, show) { /* show is either 1 or null */
		show = show || 0;
	
		/* Internal callback to run when animation has finished */
	
		function finished() {
			this.empty();
		}
	
		/* Internal callback to run before animation has started */
	
		function beforeAnimate() {
			this.css('opacity', 0);
		}
	
	
		o = $.extend({}, defaultOptions, {
			easing: 'easeInOutSine'
		}, o, { /* only run when we fadeOut */
			finished: !show ? finished : null,
			/* only run when we fadeIn */
			beforeAnimate: show ? beforeAnimate : null,
			/* animation function */
			animate: function (interval, duration, i, wordCount, parentCoords) {
	
				/* default delay */
				var delay = interval * i;
	
	/*
						Randomize delay if necessary
						Note, reverse doesn't really matter at this time
					*/
				if (o.random !== false) {
	
					var randomDelay = Math.random() * wordCount * interval,
						/* If interval or random is negative, start from the bottom instead of top */
						uniformDelay = o.reverse ? ((wordCount - i) * interval) : (i * interval);
	
					delay = randomDelay * o.random + Math.max(1 - o.random, 0) * uniformDelay;
				}
	
				/* run it */
				this.delay(delay).animate({
					opacity: show
				}, duration, o.easing);
			}
		});
	
		/* Pass everything to the general text engine */
		$.effects.textAnim.call(this, o);
	};
	
	
	$.effects.blockFadeIn = function (o) { /* Use the blockFadeOut, for redundancy purposes */
		$.effects.blockFadeOut.call(this, o, 1);
	};
	
	$.effects.textAnim = function (o) {
	
		return this.queue(
	
		function () {
	
			var replaceWith, tagReg, reg, html, i, $set, set, wordCount, duration, interval, parentCoords, $this = $(this); /* No height etc. */
			$this.width($this.width());
			$this.height($this.height());
	
	
	/*
					The following regular expression courtesy of Phil Haack
					http://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx
				*/
			tagReg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)/g;
	
			/* Translation: /(HTML tag plus spaces)|(word/letter without '<' plus spaces)/g */
			if (o.words) {
				reg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)\s*|([^\s<]+\s*)/g;
			} else {
				reg = /(<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)\s*|([^\s<]\s*)/g;
			}
	
			/* Make sure the correct html is in place */
			if (o.text !== '') {
				$this.html(o.text);
			}
	
			/* Set the current text to use */
			o.text = $this.html();
	
			/* Get the words */
			words = o.text.match(reg);
	
			/* Array for HTML, will join later */
			html = [];
	
			/* Loop over the words and seperate them (put 'em in a span) */
			for (i = 0, l = words.length; i < l; i++) {
				var word = words[i];
	
				if (!word.match(tagReg)) {
					html.push('<span>' + word + '</span>');
				} else {
					html.push(word);
				}
			}
	
	
			/* See how many words there are */
			wordCount = html.length;
	
			/* No words? halt */
			if (!wordCount) {
				return;
			}
	
			/* Put the newer correct html in place */
			$this.html(html.join(''));
	
			/* Retreive the total set of elements */
			$set = $this.find('span:not(:has(span))');
			set = $set.get();
	
			/* Calculate the duration and interval points */
			interval = (o.duration / (1.5 * wordCount));
	
			duration = (o.duration - wordCount * interval);
	
			/* If the cycle needs to reverse, reverse it all */
			if (o.reverse) {
				set.reverse();
			}
	
			/* Width, height, left, top of parent for calculations */
			parentCoords = $.extend($this.offset(), {
				width: $this.width(),
				height: $this.height()
			});
	
			/* Iterate over all the elements run their animation function on it */
			for (i = 0, l = set.length; i < l; i++) {
				var $word = $(set[i]);
	
				/* Do something to the element before the animation starts */
				$.type(o.beforeAnimate) === 'function' && o.beforeAnimate.call($word);
	
	/*
						Call the animation per element
						This way each method can define it's manipulation per element
					*/
				o.animate.call($word, interval, duration, i, wordCount, parentCoords);
			}
	
			setTimeout(
	
			function () { /* internal callback when event has finished, therefor pass object */
				$.type(o.finished) === 'function' && o.finished.call($this);
	
				/* normal object, expecting domElement, so give it */
				$.type(o.callback) === 'function' && o.callback.call($this[0]);
	
				/* dequeue the shizzle */
				$this.dequeue();
			}, o.duration);
	
		});
	};

})(jQuery);
