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
$(document).ready(function () {
  var currentUrl = window.location.pathname; // текущий путь, например /catalog.html

  $('.menu-header a').each(function () {
    var linkUrl = $(this).attr('href');

    // Проверяем совпадение пути
    if (linkUrl === currentUrl || (linkUrl === 'index.html' && currentUrl === '/')) {
      $(this).addClass('active');
    }
  });
});

$(document).ready(function () {
  var currentUrl = window.location.pathname; // текущий путь, например /catalog.html

  $('.header-bottom-menu a').each(function () {
    var linkUrl = $(this).attr('href');

    // Проверяем совпадение пути
    if (linkUrl === currentUrl || (linkUrl === 'index.html' && currentUrl === '/')) {
      $(this).addClass('active');
    }
  });
});

// menu header-bottom
$(function () {
  // проверка (опционально)
  if (typeof jQuery === 'undefined') {
    console.error('jQuery не найден');
    return;
  }

  var $btn = $('.btn-burger');
  var $menu = $('.header-bottom');

  // клик по кнопке — остановим всплытие, переключаем классы
  $btn.on('click', function (e) {
    e.stopPropagation();         // <- самое главное
    e.preventDefault();      // используй только если это <a href="#"> и нужно блокировать переход
    $(this).toggleClass('active');
    $menu.toggleClass('open');
    $('body').toggleClass('no-scroll');
  });

  // клик внутри меню не закрывает
  $menu.on('click', function (e) {
    e.stopPropagation();         // <- нужно, чтобы document click не срабатывал
  });

  // клик вне — закрываем
  $(document).on('click', function () {
    $btn.removeClass('active');
    $menu.removeClass('open');
    $('body').removeClass('no-scroll');
  });

  // Esc — тоже закрываем
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      $btn.removeClass('active');
      $menu.removeClass('open');
      $('body').removeClass('no-scroll');
    }
  });
});

// animate title
$(document).ready(function () {

  function splitLettersKeepingSpaces($el) {
    // не делаем дважды
    if ($el.data('letters-split')) return;
    const nodes = $el.contents().toArray();
    $el.empty();

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === ' ') {
            // обычный пробел — добавляем текстовый узел, чтобы разрешить переносы
            $el.append(document.createTextNode(' '));
          } else if (ch === '\u00A0') {
            // если в исходнике был &nbsp;
            $el.append(document.createTextNode('\u00A0'));
          } else if (ch === '\n' || ch === '\r') {
            // игнорируем переводы строк в исходном тексте
          } else {
            // буква — оборачиваем в span
            const $span = $('<span>').text(ch);
            $el.append($span);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'br') {
        $el.append('<br>');
      } else {
        // на всякий случай: если внутри были другие элементы — берем их текст
        const txt = $(node).text();
        for (let i = 0; i < txt.length; i++) {
          const ch = txt[i];
          if (ch === ' ') {
            $el.append(document.createTextNode(' '));
          } else if (ch === '\u00A0') {
            $el.append(document.createTextNode('\u00A0'));
          } else {
            $el.append($('<span>').text(ch));
          }
        }
      }
    });

    $el.data('letters-split', true);
  }

  function animateLettersOnce($el) {
    if ($el.data('animated')) return; // один раз по умолчанию
    const $letters = $el.find('span');
    if ($letters.length === 0) return;

    // 1-я фаза — до 0.5 (поочерёдно)
    $letters.each(function (i) {
      const $s = $(this);
      setTimeout(function () {
        $s.addClass('half');
      }, i * 420); // темп первой фазы
    });

    // 2-я фаза — до 1.0 (быстрее)
    setTimeout(function () {
      $letters.each(function (i) {
        const $s = $(this);
        setTimeout(function () {
          $s.removeClass('half').addClass('visible');
        }, i * 200); // темп второй фазы (быстрее)
      });
    }, $letters.length * 420 + 1600);

    $el.data('animated', true);
  }

  // Подготовка (разбиваем тексты на буквы, сохраняя пробелы и <br>)
  $('.anim-letters').each(function () {
    splitLettersKeepingSpaces($(this));
  });

  // Запуск анимации при загрузке/скролле
  $(window).on('load scroll', function () {
    $('.anim-letters').each(function () {
      animateLettersOnce($(this));
    });
  });

  // Если нужно — можно принудительно запустить для всех сразу:
  // $('.anim-letters').each(function () { animateLettersOnce($(this)); });

});

// toggle projects card
$(document).ready(function () {
  const step = 3; // сколько показывать при каждом клике

  function getVisibleCount() {
    // на мобильных (<768px) — 4, иначе 7
    return $(window).width() < 768 ? 4 : 7;
  }

  function initProjects($tabPane) {
    const $projects = $tabPane.find('.project-col');
    const $btn = $tabPane.find('.btn-toggle-projects');
    const visibleCount = getVisibleCount();

    // сначала показать нужное количество, остальные скрыть
    $projects.hide().slice(0, visibleCount).show();

    // показать кнопку, если карточек больше
    if ($projects.length > visibleCount) {
      $btn.show();
    } else {
      $btn.hide();
    }

    // обработчик клика
    $btn.off('click').on('click', function (e) {
      e.preventDefault();
      const $hidden = $projects.filter(':hidden');
      $hidden.slice(0, step).slideDown(300);

      if ($hidden.length <= step) {
        $(this).fadeOut(200);
      }
    });
  }

  // инициализация при загрузке
  $('.tab-pane').each(function () {
    initProjects($(this));
  });

  // переинициализация при изменении ширины (например, если повернули экран)
  $(window).on('resize', function () {
    $('.tab-pane').each(function () {
      initProjects($(this));
    });
  });
});

// slick slider
$('.similar-slider').slick({
  slidesToShow: 2,
  appendArrows: '.similar-slider__nav',
  prevArrow: '<button type="button" class="slick-prev"><svg class="svg-icon"><use xlink:href="img/sprite.svg#arrow-left"></use></svg></button>',
  nextArrow: '<button type="button" class="slick-next"><svg class="svg-icon"><use xlink:href="img/sprite.svg#arrow-right"></use></svg></button>',
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        variableWidth: true
      }
    }
    
  ]
});


// map tooltip svg
$(function() {
  // Если тултипа нет в DOM, создаём и добавляем в body
  var $tooltip = $('.map-tooltip');
  if ($tooltip.length === 0) {
    $tooltip = $('<div class="map-tooltip"></div>').appendTo('body');
  }

  // селектор для областей
  var $areas = $('.map-container svg').find('path');

  // Отладочный лог: если нет областей — покажем warn
  if ($areas.length === 0) {
    console.warn('map tooltip: SVG paths not found. Make sure SVG is inline inside .map-container.');
  }

  // Помощник для корректного позиционирования (не вылезает за экран)
  function placeTooltip($tt, pageX, pageY) {
    var pad = 10;
    var ttW = $tt.outerWidth();
    var ttH = $tt.outerHeight();
    var winW = $(window).width();
    var winH = $(window).height();
    var left = pageX + 12;
    var top = pageY + 12;

    // если выходит за правый край
    if (left + ttW + pad > $(window).scrollLeft() + winW) {
      left = pageX - ttW - 12;
    }
    // если выходит за нижний край
    if (top + ttH + pad > $(window).scrollTop() + winH) {
      top = pageY - ttH - 12;
    }
    $tt.css({ left: left + 'px', top: top + 'px' });
  }

  // Наведение
  $areas.on('mouseenter', function(e) {
    var $this = $(this);
    var title = $this.attr('data-title') || $this.attr('title') || 'Без названия';
    // debug: покажем что нашли
    // console.log('mouseenter', title);

    // Добавляем класс подсветки
    $this.addClass('highlight');

    // Устанавливаем текст тултипа
    $tooltip.text(title).fadeIn(120);

    // начальное позиционирование
    placeTooltip($tooltip, e.pageX, e.pageY);
  });

  // Движение мыши
  $areas.on('mousemove', function(e) {
    placeTooltip($tooltip, e.pageX, e.pageY);
  });

  // Уход
  $areas.on('mouseleave', function(e) {
    $(this).removeClass('highlight');
    $tooltip.stop(true, true).fadeOut(80);
  });

  // На touch-устройствах: показываем по touchstart, скрываем по touchend
  $areas.on('touchstart', function(e) {
    var $this = $(this);
    var title = $this.attr('data-title') || 'Без названия';
    $this.addClass('highlight');
    $tooltip.text(title).show();
    // позиционируем в центре элемента
    var rect = this.getBoundingClientRect();
    var pageX = rect.left + rect.width / 2 + window.pageXOffset;
    var pageY = rect.top + rect.height / 2 + window.pageYOffset;
    placeTooltip($tooltip, pageX, pageY);
    // предотвращаем дальнейшее всплытие
    e.preventDefault();
  });

  $(document).on('touchend touchcancel', function() {
    $areas.removeClass('highlight');
    $tooltip.hide();
  });
});
