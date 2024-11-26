jQuery(function ($) {
  "use strict";

  // Navigation Scroll
  $(window).scroll(function (event) {
    var scrollbody = $(window).scrollTop();
    if (scrollbody >= 150) {
      $("#main-menu").addClass("navwhite");
    } else {
      $("#main-menu").removeClass("navwhite");
    }
    Scroll();
  });

  $(".navbar-collapse ul li a").on("click", function () {
    $("html, body").animate({ scrollTop: $(this.hash).offset().top - 5 }, 1000);
    return false;
  });

  // User define function
  function Scroll() {
    var contentTop = [];
    var contentBottom = [];
    var winTop = $(window).scrollTop();
    var rangeTop = 200;
    var rangeBottom = 500;
    var nav = $(".navbar-nav");
    $(".navbar-nav")
      .find(".scroll a")
      .each(function () {
        // debugger;
        var ahref = this.innerHTML;
        contentTop.push($($(this).attr("href")).offset().top);
        //            //  contentTop.push($($(this).attr('href')).offset().top);

        //            var divPosid = $(ahref);
        //            if (!divPosid.length) {
        //                return;
        //            }

        //   contentTop.push(divPosid.offset().top);
        contentBottom.push(
          $($(this).attr("href")).offset().top +
            $($(this).attr("href")).height()
        );
      });
    $.each(contentTop, function (i) {
      debugger;
      if (winTop > contentTop[i] - rangeTop) {
        debugger;
        $(".navbar-nav li.scroll")
          .removeClass("active")
          .eq(i)
          .addClass("active");
      }
    });
  }

  $("#tohash").on("click", function () {
    $("html, body").animate({ scrollTop: $(this.hash).offset().top - 5 }, 1000);
    return false;
  });

  // accordian
  $(".accordion-toggle").on("click", function () {
    $(this)
      .closest(".panel-group")
      .children()
      .each(function () {
        $(this).find(">.panel-heading").removeClass("active");
      });

    $(this).closest(".panel-heading").toggleClass("active");
  });

  //Slider
  $(document).ready(function () {
    var time = 7; // time in seconds

    var $progressBar, $bar, $elem, isPause, tick, percentTime;

    //Init the carousel
    $("#main-slider")
      .find(".owl-carousel")
      .owlCarousel({
        slideSpeed: 500,
        paginationSpeed: 500,
        singleItem: true,
        navigation: true,
        navigationText: [
          "<i class='fa fa-angle-left'></i>",
          "<i class='fa fa-angle-right'></i>",
        ],
        afterInit: progressBar,
        afterMove: moved,
        startDragging: pauseOnDragging,
        //autoHeight : true,
        transitionStyle: "fadeUp",
      });

    //Init progressBar where elem is $("#owl-demo")
    function progressBar(elem) {
      $elem = elem;
      //build progress bar elements
      buildProgressBar();
      //start counting
      start();
    }

    //create div#progressBar and div#bar then append to $(".owl-carousel")
    function buildProgressBar() {
      $progressBar = $("<div>", {
        id: "progressBar",
      });
      $bar = $("<div>", {
        id: "bar",
      });
      $progressBar.append($bar).appendTo($elem);
    }

    function start() {
      //reset timer
      percentTime = 0;
      isPause = false;
      //run interval every 0.01 second
      tick = setInterval(interval, 10);
    }

    function interval() {
      if (isPause === false) {
        percentTime += 1 / time;
        $bar.css({
          width: percentTime + "%",
        });
        //if percentTime is equal or greater than 100
        if (percentTime >= 100) {
          //slide to next item
          $elem.trigger("owl.next");
        }
      }
    }

    //pause while dragging
    function pauseOnDragging() {
      isPause = true;
    }

    //moved callback
    function moved() {
      //clear interval
      clearTimeout(tick);
      //start again
      start();
    }
  });

  //Initiat WOW JS
  new WOW().init();
  //smoothScroll
  smoothScroll.init();

  // portfolio filter
  $(window).load(function () {
    "use strict";
    var $portfolio_selectors = $(".portfolio-filter >li>a");
    var $portfolio = $(".portfolio-items");
    $portfolio.isotope({
      itemSelector: ".portfolio-item",
      layoutMode: "fitRows",
    });

    $portfolio_selectors.on("click", function () {
      $portfolio_selectors.removeClass("active");
      $(this).addClass("active");
      var selector = $(this).attr("data-filter");
      $portfolio.isotope({ filter: selector });
      return false;
    });
  });

  $(document).ready(function () {
    //Animated Progress
    $(".progress-bar").bind(
      "inview",
      function (event, visible, visiblePartX, visiblePartY) {
        if (visible) {
          $(this).css("width", $(this).data("width") + "%");
          $(this).unbind("inview");
        }
      }
    );

    //Animated Number
    $.fn.animateNumbers = function (stop, commas, duration, ease) {
      return this.each(function () {
        var $this = $(this);
        var start = parseInt($this.text().replace(/,/g, ""));
        commas = commas === undefined ? true : commas;
        $({ value: start }).animate(
          { value: stop },
          {
            duration: duration == undefined ? 1000 : duration,
            easing: ease == undefined ? "swing" : ease,
            step: function () {
              $this.text(Math.floor(this.value));
              if (commas) {
                $this.text(
                  $this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                );
              }
            },
            complete: function () {
              if (parseInt($this.text()) !== stop) {
                $this.text(stop);
                if (commas) {
                  $this.text(
                    $this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                  );
                }
              }
            },
          }
        );
      });
    };

    $(".animated-number").bind(
      "inview",
      function (event, visible, visiblePartX, visiblePartY) {
        var $this = $(this);
        if (visible) {
          $this.animateNumbers(
            $this.data("digit"),
            false,
            $this.data("duration")
          );
          $this.unbind("inview");
        }
      }
    );
  });

  // Contact form
  var form = $("#main-contact-form");
  form.submit(function (event) {
    event.preventDefault();
    var form_status = $('<div class="form_status"></div>');
    $.ajax({
      url: $(this).attr("action"),
      beforeSend: function () {
        form.prepend(
          form_status
            .html(
              '<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>'
            )
            .fadeIn()
        );
      },
    }).done(function (data) {
      form_status
        .html(
          '<p class="text-success">Thank you for contact us. As early as possible  we will contact you</p>'
        )
        .delay(3000)
        .fadeOut();
    });
  });

  //Pretty Photo
  $("a[rel^='prettyPhoto']").prettyPhoto({
    social_tools: false,
  });
});

$("#partnercrausel").carousel({
  interval: 5000,
  pause: "hover",
  wrap: true,
});

$(".5column .item").each(function () {
  var next = $(this);
  var last;
  for (var i = 0; i < 4; i++) {
    next = next.next();
    if (!next.length) {
      next = $(this).siblings(":first");
    }

    last = next.children(":first-child").clone().appendTo($(this));
  }
  last.addClass("rightest");
});

$(".4column .item").each(function () {
  var next = $(this);
  var last;
  for (var i = 0; i < 3; i++) {
    next = next.next();
    if (!next.length) {
      next = $(this).siblings(":first");
    }

    last = next.children(":first-child").clone().appendTo($(this));
  }
  last.addClass("rightest");
});

var $video = $("video"),
  $window = $(window);

$(window)
  .resize(function () {
    var height = $window.height();
    $video.css("height", height);

    var videoWidth = $video.width(),
      windowWidth = $window.width(),
      marginLeftAdjust = (windowWidth - videoWidth) / 2;

    $video.css({
      height: height,
      marginLeft: marginLeftAdjust,
    });
  })
  .resize();



  var countDownDate = new Date("Nov 27, 2023 15:37:25").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  // document.getElementById("countDown").innerHTML = days + "d " + hours + "h "
  // + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  // if (distance < 0) {
  //   clearInterval(x);
  //   document.getElementById("countDown").innerHTML = "EXPIRED";
  // }
}, 1000);

// ....................................
function updateTimer() {
  future = Date.parse("nov 27, 2023 01:30:00");
now = new Date();
diff = future - now;

days = Math.floor(diff / (1000 * 60 * 60 * 24));
hours = Math.floor(diff / (1000 * 60 * 60));
mins = Math.floor(diff / (1000 * 60));
secs = Math.floor(diff / 1000);

d = days;
h = hours - days * 24;
m = mins - hours * 60;
s = secs - mins * 60;

// document.getElementById("timer")
// .innerHTML =
// '<div>' + d + '<span>Days</span></div>' +
// '<div>' + h + '<span>Hours</span></div>' +
// '<div>' + m + '<span>Minutes</span></div>' +
// '<div>' + s + '<span>Seconds</span></div>';
}
setInterval('updateTimer()', 1000);
