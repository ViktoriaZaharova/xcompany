// mouse animate
(() => {
  const canvas = document.getElementById('mouseCanvas');
  const ctx = canvas.getContext('2d', { alpha: true });

  let W = window.innerWidth;
  let H = window.innerHeight;
  let DPR = window.devicePixelRatio || 1;

  function resize() {
    DPR = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const MAX_POINTS = 100;      // меньше точек — быстрее исчезает
  const CONNECT_DIST = 100;   // расстояние соединения
  const FADE_STEP = 0.1;     // очень быстро исчезает
  const LINE_WIDTH = 0.1;     // ещё тоньше

  let points = [];

  window.addEventListener('pointermove', e => {
    points.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (points.length > MAX_POINTS) points.shift();
  });

  function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);

    // отключаем любые тени
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // линии
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.5 * p.life;
          ctx.strokeStyle = `rgba(29,33,38,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    // точки
    for (let k = 0; k < points.length; k++) {
      const p = points[k];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 0.5, 0, Math.PI * 2); // микроточки
      ctx.fillStyle = `rgba(29,33,38,${Math.min(1, p.life)})`;
      ctx.fill();
      p.life -= FADE_STEP;
    }

    points = points.filter(pt => pt.life > 0);
  }

  draw();
})();
// mouse animate end

// animate section scroll
AOS.init({
  duration: 1800, // скорость анимации
  once: true     // анимация только 1 раз (не повторяется при скролле назад)
});

// video autoplay
$(function () {
  const startedVideos = new WeakSet(); // какие видео уже запускались

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const video = entry.target;
        if (!startedVideos.has(video)) {
          $(video).get(0).play().catch(err => console.log("Автозапуск заблокирован:", err));
          startedVideos.add(video);
        }
      }
    });
  }, { threshold: 0.3 });

  $(".auto-video").each(function () {
    observer.observe(this);
  });
});

// video play button
$(function () {
  $(".video-wrapper").each(function () {
    const $wrapper = $(this);
    const $video = $wrapper.find(".manual-video");
    const $btn = $wrapper.find(".play-btn");

    // Запуск по клику
    $btn.on("click", function () {
      $video.get(0).play();
      $btn.hide();
    });

    // Пауза → показать кнопку
    $video.on("pause", function () {
      $btn.show();
    });

    // Воспроизведение → скрыть кнопку
    $video.on("play", function () {
      $btn.hide();
    });
  });
});

// phone mask
$('[name="phone"]').mask('+7 (999) 999-99-99');

// fancybox
Fancybox.bind("[data-fancybox]", {
  // Your custom options
});

// menu active link
$(document).ready(function() {
  var currentUrl = window.location.pathname; // текущий путь, например /catalog.html

  $('.menu-header a').each(function() {
    var linkUrl = $(this).attr('href');

    // Проверяем совпадение пути
    if (linkUrl === currentUrl || (linkUrl === 'index.html' && currentUrl === '/')) {
      $(this).addClass('active');
    }
  });
});

$(document).ready(function() {
  var currentUrl = window.location.pathname; // текущий путь, например /catalog.html

  $('.header-bottom-menu a').each(function() {
    var linkUrl = $(this).attr('href');

    // Проверяем совпадение пути
    if (linkUrl === currentUrl || (linkUrl === 'index.html' && currentUrl === '/')) {
      $(this).addClass('active');
    }
  });
});

// menu header-bottom
$(function() {
  // проверка (опционально)
  if (typeof jQuery === 'undefined') {
    console.error('jQuery не найден');
    return;
  }

  var $btn = $('.btn-burger');
  var $menu = $('.header-bottom');

  // клик по кнопке — остановим всплытие, переключаем классы
  $btn.on('click', function(e) {
    e.stopPropagation();         // <- самое главное
    e.preventDefault();      // используй только если это <a href="#"> и нужно блокировать переход
    $(this).toggleClass('active');
    $menu.toggleClass('open');
    $('body').toggleClass('no-scroll');
  });

  // клик внутри меню не закрывает
  $menu.on('click', function(e) {
    e.stopPropagation();         // <- нужно, чтобы document click не срабатывал
  });

  // клик вне — закрываем
  $(document).on('click', function() {
    $btn.removeClass('active');
    $menu.removeClass('open');
    $('body').removeClass('no-scroll');
  });

  // Esc — тоже закрываем
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      $btn.removeClass('active');
      $menu.removeClass('open');
      $('body').removeClass('no-scroll');
    }
  });
});

// animate title
$(document).ready(function () {
  function animateLetters($element) {
    var text = $element.text();
    $element.html('');

    // Разбиваем текст на отдельные буквы
    for (var i = 0; i < text.length; i++) {
      var char = text[i] === ' ' ? '&nbsp;' : text[i];
      $element.append('<span>' + char + '</span>');
    }

    $(window).on('scroll load', function () {
      var top = $element.offset().top;
      var bottom = top + $element.outerHeight();
      var scrollTop = $(window).scrollTop();
      var windowBottom = scrollTop + $(window).height();

      if (bottom > scrollTop && top < windowBottom) {
        var $letters = $element.find('span');

        // 1️⃣ Первая фаза — поочерёдно до полупрозрачности
        $letters.each(function (i) {
          var $span = $(this);
          setTimeout(function () {
            $span.addClass('half');
          }, i * 420); // естественный темп (между 240 и 480)
        });

        // 2️⃣ Вторая фаза — до полного проявления, быстрее
        setTimeout(function () {
          $letters.each(function (i) {
            var $span = $(this);
            setTimeout(function () {
              $span.removeClass('half').addClass('visible');
            }, i * 200); // быстрее вторая волна
          });
        }, $letters.length * 420 + 1600); // пауза между фазами немного короче
      }
    });
  }

  $('.anim-letters').each(function () {
    animateLetters($(this));
  });
});

