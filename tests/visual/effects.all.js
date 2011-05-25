
$(function() {
	var duration = 1000, wait = 500;

	$("div.effect")
		.hover(function() { $(this).addClass("hover"); },
			function() { $(this).removeClass("hover"); });

	var effect = function(el, n, o, text) {
		var effect;
		if ( !text ) {
			effect = $.fn.effect;
		} else {
			effect = $.fn.textEffect;
		}
		
		$.extend(o, {
			easing: "easeOutQuint"
		});
		
		el = $( el );
		
		el.bind("click", function() {
			el.addClass("current");
			effect.call( el,  n, $.extend( o, { mode: 'hide' } ), duration, function() {
				window.setTimeout( function() {
					effect.call( el, n, $.extend( o, { mode: 'show' } ), duration, function() { 
						el.removeClass("current"); 
					} );
				}, wait );
			} );
		} );

	};
	
	$("#hide").click(function() {
		var el = $(this);
		el.addClass("current").hide(duration, function() {
			setTimeout(function() {
				el.show(duration, function() { el.removeClass("current") });
			}, wait);
		})
	})

	effect("#blindHorizontally", "blind", { direction: "horizontal" });
	effect("#blindVertically", "blind", { direction: "vertical" });

	effect("#bounce3times", "bounce", { times: 3 });

	effect("#clipHorizontally", "clip", { direction: "horizontal" });
	effect("#clipVertically", "clip", { direction: "vertical" });

	effect("#dropDown", "drop", { direction: "down" });
	effect("#dropUp", "drop", { direction: "up" });
	effect("#dropLeft", "drop", { direction: "left" });
	effect("#dropRight", "drop", { direction: "right" });

	effect("#explode9", "explode", {});
	effect("#explode36", "explode", { pieces: 36 });

	effect("#fade", "fade", {});

	effect("#fold", "fold", { size: 50 });

	effect("#highlight", "highlight", {});

	effect("#pulsate", "pulsate", { times: 2 });

	effect("#puff", "puff", { times: 2 });
	effect("#scale", "scale", {});

	$("#shake").bind("click", function() { $(this).addClass("current").effect("shake", {}, 100, function() { $(this).removeClass("current"); }); });

	effect("#slideDown", "slide", { direction: "down" });
	effect("#slideUp", "slide", { direction: "up" });
	effect("#slideLeft", "slide", { direction: "left" });
	effect("#slideRight", "slide", { direction: "right" });

	$("#transfer").bind("click", function() { $(this).addClass("current").effect("transfer", { to: "div:eq(0)" }, 1000, function() { $(this).removeClass("current"); }); });

	$("#addClass").click(function() {
		$(this).addClass(function() {
			window.console && console.log(arguments);
			return "current";
		}, duration, function() {
			$(this).removeClass("current");
		});
	});
	$("#removeClass").click(function() {
		$(this).addClass("current").removeClass(function() {
			window.console && console.log(arguments);
			return "current"
		}, duration);
	});
	$("#toggleClass").click(function() {
		$(this).toggleClass(function() {
			window.console && console.log(arguments);
			return "current"
		}, duration);
	});
	
	effect( "#textExplode", "explode", { easing: "linear" }, true );
	effect( "#textType", "type", { easing: "linear" }, true );
	effect( "#textBuild", "build", { easing: "linear" }, true );
	effect( "#textBlockfade", "blockfade", { easing: "linear" }, true );
	
	effect( "#textExplodeWord", "explode", { easing: "linear", words: true }, true );
	effect( "#textTypeWord", "type", { easing: "linear", words: true }, true );
	effect( "#textBuildWord", "build", { easing: "linear", words: true }, true );
	effect( "#textBlockfadeWord", "blockfade", { easing: "linear", words: true }, true );
		
});
