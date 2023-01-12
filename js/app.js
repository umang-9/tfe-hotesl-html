jQuery.noConflict();

(function ($) { // noConflict function start

	$(function () {	// ready function start
		console.log("Ready");

		/* [Init Parallax] */
		if ($(".parallax").length) {
			// init ScrollMagic controller
			var ctrlParallax = new ScrollMagic.Controller({
				globalSceneOptions: { triggerHook: "onEnter", duration: "200%" },
			});
			var parallaxElements = $(".parallax");

			// build scenes
			for (var i = 0; i < parallaxElements.length; i++) {
				parallaxImage = $(parallaxElements[i]).children(".parallax-inner");
				new ScrollMagic.Scene({
					triggerElement: parallaxElements[i],
				})
					.setTween(parallaxImage, {
						y: "30%",
					})
					// .addIndicators()
					.addTo(ctrlParallax);
			}
		}

		/* [Sidebar toggle] */
		$('.sidebar-toggler').on('click', function () {
			$('.sidebar').toggleClass('active');
			$('body').toggleClass('sidebar-active');
		});

		/* [Sidebar close on overlay clicked] */
		$('.overlay').on('click', function () {
			$('.sidebar').removeClass('active');
			$('body').removeClass('sidebar-active');
		});

		/* [Init ScrollMagic controller for Reveal on scroll] */
		var ctrlReveal = null;
		if ($('.reveal').length) {
			ctrlReveal = new ScrollMagic.Controller();

			// var revealElements = document.getElementsByClassName("reveal");
			var revealElements = $(".reveal");
			for (var i = 0; i < revealElements.length; i++) { 		// create a scene for each element
				// console.log(revealElements[i]);
				new ScrollMagic.Scene({
					triggerElement: revealElements[i], 								// y value not modified, so we can use element as trigger as well
					offset: 50,												 								// start a little later
					triggerHook: 0.9,
					reverse: false
				})
					.setClassToggle(revealElements[i], "visible") 		// add class toggle
					// .addIndicators({ name: "element " + (i + 1) }) 			// add indicators (requires plugin)
					.addTo(ctrlReveal);
			}
		}

		/* [Init texture animation using ScrollMagic] */
		var ctrlTexture = null;
		animateTexture = function () {
			if (ctrlTexture !== null && ctrlTexture !== undefined) {
				// completely destroy the controller
				ctrlTexture = ctrlTexture.destroy(true);
				// if needed, use jQuery to manually remove styles added to DOM elements by GSAP etc. here
			}
			ctrlTexture = new ScrollMagic.Controller();

			var durTexture = $('.banner').outerHeight() - $('.bg-intro').outerHeight();
			var scene = new ScrollMagic.Scene({
				triggerElement: ".banner",
				duration: durTexture,
				triggerHook: 0
			})
				.addTo(ctrlTexture)
				// .addIndicators()
				.on("progress", function (e) {
					// console.log((e.progress * 100).toFixed(0) + "%");
					$('.banner-texture').css({
						'opacity': e.progress
					})
				});
		}

		animateTexture();

		/* [Pin main circle] */
		var ctrlPinCircle = null;
		animatePin = function () {
			var hgtWindow = $(window).height();

			// calculate the hook from bottom
			var hookFromBottom = 70
			var pinTriggerHook = (hgtWindow - hookFromBottom) / hgtWindow;
			// console.log(pinTriggerHook);

			// calculate the pin drop
			var pinOffset = 60
			var pinDurationCircle = $('.pin-spacer-end').offset().top - $('.pin-spacer-start').offset().top - 40;
			var lineHeight = $('.pin-spacer-end').offset().top - $('.graphic-line-main').offset().top + 68;

			if (window.matchMedia("(max-width: 1024px) and (max-height: 768px)").matches) {
				var pinDurationCircle = $('.pin-spacer-end').offset().top - $('.pin-spacer-start').offset().top + -20;
				var lineHeight = $('.pin-spacer-end').offset().top - $('.graphic-line-main').offset().top + 88;
				console.log("1024*768 screen");
			}

			if (window.matchMedia("(max-width: 991px)").matches) {
				var pinDurationCircle = $('.pin-spacer-end').offset().top - $('.pin-spacer-start').offset().top - 60;
				var lineHeight = $('.pin-spacer-end').offset().top - $('.graphic-line-main').offset().top + 48;
				console.log("991");
			}

			if (window.matchMedia("(max-width: 767px)").matches) {
				var pinDurationCircle = $('.pin-spacer-end').offset().top - $('.pin-spacer-start').offset().top + 40;
				var lineHeight = $('.pin-spacer-end').offset().top - $('.graphic-line-main').offset().top + 148;
				console.log("767");
			}

			$('.graphic-line-main .graphic').height(lineHeight);

			if (ctrlPinCircle !== null && ctrlPinCircle !== undefined) {
				// completely destroy the controller
				ctrlPinCircle = ctrlPinCircle.destroy(true);
				// if needed, use jQuery to manually remove styles added to DOM elements by GSAP etc. here
			}

			ctrlPinCircle = new ScrollMagic.Controller();
			var pinElements = $('.pin-circle');

			var scene = new ScrollMagic.Scene({
				triggerElement: ".pin-circle",
				triggerHook: pinTriggerHook,
				duration: pinDurationCircle
			})
				.setPin(".pin-circle-start")
				// .addIndicators({ name: "Pin (duration: " + pinDurationCircle + ")" }) // add indicators (requires plugin)
				.addTo(ctrlPinCircle)
				.on("progress", function (e) {
					// console.log((e.progress * 100).toFixed(0) + "%");
					if (e.progress * 100 > 4) {
						$('.graphic-circle').addClass('active-small');
					} else {
						$('.graphic-circle').removeClass('active-small');
					}
				});
		}

		// animatePin();

		$(window).on("resize", function () {
			// console.log('resize');
			animateTexture();

			setTimeout(function () {
				animatePin();
			}, 200);
		});

		$(window).scroll(function () {
			if ($(this).scrollTop() > 200) { // this refers to window
				// console.log("You've scrolled 200 pixels.");
				animatePin();
			}
		});

		/* [SVG] */
		/*
		function pathPrepare ($el) {
			var lineLength = $el[0].getTotalLength();
			$el.css("stroke-dasharray", lineLength);
			$el.css("stroke-dashoffset", lineLength);
			console.log(lineLength);
		}
	
		var $word 		= $("path#word");
		var $dot 			= $("path#dot");
		var $eclipse 	= $("#eclipse circle");
	
		// prepare SVG
		// pathPrepare($word);
		// pathPrepare($dot);
		pathPrepare($eclipse);
	
		// init controller
		var controller = new ScrollMagic.Controller();
	
		// build tween
		var tween = new TimelineMax()
			// .add(TweenMax.to($word, 0.9, {strokeDashoffset: 0, ease:Linear.easeNone})) // draw word for 0.9
			// .add(TweenMax.to($dot, 0.1, {strokeDashoffset: 0, ease:Linear.easeNone}))  // draw dot for 0.1
			.add(TweenMax.to($eclipse, 1, {strokeDashoffset: 0, ease:Linear.easeNone}))  // draw dot for 0.1
			// .add(TweenMax.to("path", 1, {stroke: "#33629c", ease:Linear.easeNone}), 0);			// change color during the whole thing
	
		// build scene
		var scene = new ScrollMagic.Scene({triggerElement: "#trigger1", triggerHook: 1, duration: 200, tweenChanges: true})
						.setTween(tween)
						.addIndicators() // add indicators (requires plugin)
						.addTo(controller);
		*/

		/* ------------------ Events / Functions ------------------ */

		/* [Event to scroll by Id */
		$(".scroll-to").on("click", function (e) {
			e.preventDefault();
			var hash = $(this).attr("href");
			scrollToAnimate(hash);
		});

		/* [Smoothly scroll to section by Hash/Id] */
		scrollToAnimate = function (hash) {
			// console.log(hash);
			if (hash != null && hash != undefined) {
				var scrollPos = $(hash).offset().top;
				$('html, body').animate({
					scrollTop: scrollPos
				}, 1000, 'easeInOutExpo', function () {
					// Add hash (#) to URL when done scrolling (default click behavior)
					// window.location.hash = hash;
				});
			}
		}

		$(".collect-slider").slick({
			dots: true,
			arrows: false,
			infinite: true,
			slidesToShow: 1,
			touchThreshold: 100,
			fade: true,
			speed: 900,
			cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
		});

	}); // ready function end

	$(window).on("load", function () {
		$('body').addClass('loaded');
		animatePin();
	});

})(jQuery); // noConflict function end