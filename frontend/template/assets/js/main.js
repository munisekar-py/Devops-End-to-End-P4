// ==================================================
// * Project Name   :  Collab – Online Learning Platform Template
// * File           :  JS Base
// * Version        :  1.0.0
// * Last change    :  15 April 2023, Saturday
// * Author         :  Merkulove (https://themeforest.net/user/merkulove)
// * Developer      :  webrok (https://www.fiverr.com/webrok?up_rollout=true)
// ==================================================

(function($) {
  "use strict";

  // Vanilla Calendar - Start
  // --------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const calendar = new VanillaCalendar('.vanilla-calendar');
    calendar.init();
  });
  // Vanilla Calendar - End
  // --------------------------------------------------

  // Back To Top - Start
  // --------------------------------------------------
  $(window).scroll(function() {
    if ($(this).scrollTop() > 200) {
      $('.backtotop:hidden').stop(true, true).fadeIn();
    } else {
      $('.backtotop').stop(true, true).fadeOut();
    }
  });
  $(function() {
    $(".scroll").on('click', function() {
      $("html,body").animate({scrollTop: 0}, "slow");
      return false
    });
  });
  // Back To Top - End
  // --------------------------------------------------

  // sticky header - start
  // --------------------------------------------------
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 0) {
      $('.site_header').addClass("sticky")
    } else {
      $('.site_header').removeClass("sticky")
    }
  });
  // sticky header - end
  // --------------------------------------------------

  // OffCanvas - Start
  // --------------------------------------------------
  $(document).ready(function () {
    $('.offCanvas_close_btn, .offCanvas_overlay').on('click', function () {
      $('.filter_offcanvas.position-fixed').removeClass('active');
      $('.offCanvas_overlay').removeClass('active');
    });

    $('.offCanvas_open_btn').on('click', function () {
      $('.filter_offcanvas.position-fixed').addClass('active');
      $('.offCanvas_overlay').addClass('active');
    });
  });
  // OffCanvas - End
  // --------------------------------------------------

  // wow js - start
  // --------------------------------------------------
  var wow = new WOW({
    animateClass: 'animated',
    offset: 100,
    mobile: true,
    duration: 400,
  });
  wow.init();
  // wow js - end
  // --------------------------------------------------

  // Tilt - Start
  // --------------------------------------------------
  $('.tilt').tilt({
    maxTilt:        12,
    perspective:    1000,
    scale:          1,
    speed:          1000,
    glare:          false,
    maxGlare:       1
  });
  // Tilt - End
  // --------------------------------------------------

  // Dropdown - Start
  // --------------------------------------------------
  $(document).ready(function () {
    $(".dropdown").on('mouseover', function () {
      $(this).find('> .dropdown-menu').addClass('show');
    });
    $(".dropdown").on('mouseout', function () {
      $(this).find('> .dropdown-menu').removeClass('show');
    });
  });
  // Dropdown - End
  // --------------------------------------------------

  // Counter Up - Start
  // --------------------------------------------------
  $('.counter_value_text').counterUp({
    delay: 10,
    time: 1000
  });
  // Counter Up - End
  // --------------------------------------------------

  // Mouse Move Parallax - Start
  // --------------------------------------------------
  $('.mouse_move').parallax({
    scalarX: 10.0,
    scalarY: 10.0,
  });
  // Mouse Move Parallax - End
  // --------------------------------------------------

  // Videos & Images popup - Start
  // --------------------------------------------------
  $('.popup_video').magnificPopup({
    type: 'iframe',
    preloader: false,
    removalDelay: 160,
    mainClass: 'mfp-fade',
    fixedContentPos: false
  });

  $('.zoom-gallery').magnificPopup({
    delegate: '.popup_image',
    type: 'image',
    closeOnContentClick: false,
    closeBtnInside: false,
    mainClass: 'mfp-with-zoom mfp-img-mobile',
    gallery: {
      enabled: true
    },
    zoom: {
      enabled: true,
      duration: 300,
      opener: function(element) {
        return element.find('img');
      }
    }
    
  });
  // Videos & Images popup - End
  // --------------------------------------------------

  // Multy Countdown - Start
  // --------------------------------------------------
  $('.countdown_timer').each(function(){
    $('[data-countdown]').each(function() {
      var $this = $(this), finalDate = $(this).data('countdown');
      $this.countdown(finalDate, function(event) {
        var $this = $(this).html(event.strftime(''
          + '<li class="days_count"><strong>%D</strong><span>Days</span></li>'
          + '<li class="hours_count"><strong>%H</strong><span>Hours</span></li>'
          + '<li class="minutes_count"><strong>%M</strong><span>Mins</span></li>'
          + '<li class="seconds_count"><strong>%S</strong><span>Secs</span></li>'));
      });
    });
  });
  // Multy Countdown - End
  // --------------------------------------------------

  // Common Carousels - Start
  // --------------------------------------------------
  $('.common_carousel_1col').slick({
    dots: true,
    speed: 1000,
    arrows: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    pauseOnHover: true,
    autoplaySpeed: 5000,
    prevArrow: ".cc1c_left_arrow",
    nextArrow: ".cc1c_right_arrow"
  });

  $('.common_carousel_2col').slick({
    dots: true,
    speed: 1000,
    arrows: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    pauseOnHover: true,
    autoplaySpeed: 5000,
    prevArrow: ".cc2c_left_arrow",
    nextArrow: ".cc2c_right_arrow",
    responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    ]
  });
  // Common Carousels - End
  // --------------------------------------------------

})(jQuery);