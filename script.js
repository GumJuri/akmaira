(function () {
  var nav = document.querySelector(".main-nav");
  var navToggle = document.querySelector(".nav-toggle");
  var slideMedia = document.getElementById("slideMedia");
  var dots = document.getElementById("sliderDots");
  var prev = document.querySelector(".slider-prev");
  var next = document.querySelector(".slider-next");
  var canvas = document.getElementById("sparkCanvas");
  var ctx = canvas ? canvas.getContext("2d") : null;

  var sliderImages = [
    {
      src: "./assets/slide-1.png",
      alt: "Akmaira — команда героев в аниме-стиле"
    },
    {
      src: "./assets/slide-2.png",
      alt: "Akmaira — героиня с посохом"
    },
    {
      src: "./assets/slide-3.png",
      alt: "Множество мини-игр: строительство, подземелья и настольные игры"
    },
    {
      src: "./assets/slide-4.png",
      alt: "Стратегия и эффектные бои — тактический RPG"
    },
    {
      src: "./assets/slide-5.png",
      alt: "100+ полезных героев — любой герой становится UR"
    },
    {
      src: "./assets/slide-6.png",
      alt: "Akmaira — героиня с кошачьими ушками"
    }
  ];

  var currentSlide = 0;
  var autoplayTimer;

  function renderPlaceholder() {
    if (!slideMedia) return;
    slideMedia.innerHTML = [
      '<div class="slide-placeholder">',
      "<span>Akmaira</span>",
      "<strong>Добавьте изображения в папку assets и укажите их в sliderImages</strong>",
      "</div>"
    ].join("");
  }

  function renderDots() {
    if (!dots) return;
    dots.innerHTML = sliderImages.map(function (_, index) {
      return '<button type="button" aria-label="Показать слайд ' + (index + 1) + '" data-slide="' + index + '"></button>';
    }).join("");
  }

  function updateDots() {
    if (!dots) return;
    dots.querySelectorAll("button").forEach(function (button, index) {
      button.classList.toggle("is-active", index === currentSlide);
    });
  }

  function showSlide(index) {
    if (!slideMedia || !sliderImages.length) return;
    currentSlide = (index + sliderImages.length) % sliderImages.length;
    var image = sliderImages[currentSlide];
    var img = new Image();
    img.alt = image.alt;
    img.onload = function () {
      slideMedia.innerHTML = "";
      slideMedia.appendChild(img);
      updateDots();
    };
    img.onerror = function () {
      renderPlaceholder();
      updateDots();
    };
    img.src = image.src;
  }

  function resetAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 4500);
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (slideMedia) {
    renderDots();
    showSlide(0);
    resetAutoplay();

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(currentSlide - 1);
        resetAutoplay();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(currentSlide + 1);
        resetAutoplay();
      });
    }

    if (dots) {
      dots.addEventListener("click", function (event) {
        var target = event.target.closest("button");
        if (!target) return;
        showSlide(Number(target.dataset.slide));
        resetAutoplay();
      });
    }
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section-reveal").forEach(function (element) {
    observer.observe(element);
  });

  if (!canvas || !ctx) return;

  var sparks = [];
  var palette = ["#ff6aa9", "#8d6bff", "#44d7e8", "#ff8a78", "#9df2d1"];

  function resizeCanvas() {
    var ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createSpark(startAnywhere) {
    var size = Math.random() * 4 + 2;
    return {
      x: Math.random() * window.innerWidth,
      y: startAnywhere ? Math.random() * window.innerHeight : window.innerHeight + 20,
      size: size,
      speed: Math.random() * 0.45 + 0.16,
      drift: (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.42 + 0.14,
      color: palette[Math.floor(Math.random() * palette.length)]
    };
  }

  function resetSparks() {
    sparks = [];
    var count = window.innerWidth < 700 ? 34 : 62;
    for (var i = 0; i < count; i += 1) {
      sparks.push(createSpark(true));
    }
  }

  function drawSpark(spark) {
    ctx.save();
    ctx.globalAlpha = spark.alpha;
    ctx.translate(spark.x, spark.y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = spark.color;
    ctx.fillRect(-spark.size / 2, -spark.size / 2, spark.size, spark.size);
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    sparks.forEach(function (spark) {
      spark.y -= spark.speed;
      spark.x += spark.drift;
      if (spark.y < -20 || spark.x < -30 || spark.x > window.innerWidth + 30) {
        Object.assign(spark, createSpark(false));
      }
      drawSpark(spark);
    });
    window.requestAnimationFrame(animate);
  }

  resizeCanvas();
  resetSparks();
  window.addEventListener("resize", function () {
    resizeCanvas();
    resetSparks();
  });
  animate();
})();
