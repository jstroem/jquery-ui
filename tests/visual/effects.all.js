
$(function() {
	var duration = 1000, wait = 500;

	$("div.effect")
		.hover(function() { $(this).addClass("hover"); },
			function() { $(this).removeClass("hover"); });

	var effect = function(el, n, o) {

		$.extend(o, {
			easing: "easeOutQuint"
		});

		$(el).bind("click", function() {

			$(this).addClass("current").hide(n, o, duration, function() {
				var self = this;
				window.setTimeout(function() {
					$(self).show(n, o, duration, function() { $(this).removeClass("current"); });
				}, wait);
			});
		});

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
	
	$("#piecer").click(function(){
		$.effects.piecer.call(this, 5, 5);
	});
	$("#build").click(function(){
		$(this).hide("build",{easing: 'linear'},2000,function(){
			console.log("testing");
			$(this).show("build");
		});
	});
});
