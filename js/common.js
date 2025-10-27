
// показать карточку товара по наведению в зависимости от значениея data-tab
$(document).ready(function () {
  var hideTimeout;

  // Наведение на карточку
  $(".js-tab-trigger").on("mouseenter", function () {
    if ($(window).width() >= 992) {
      clearTimeout(hideTimeout); // отменяем возврат, если курсор снова на карточке
      var $wrapper = $(this).parents('.sustainability-wrapper');
      var id = $(this).attr('data-tab');
      var $content = $wrapper.find('.js-tab-content[data-tab="' + id + '"]');

      // скрываем sustainability-content один раз
      $wrapper.find('.sustainability-content').stop(true, true).fadeOut(200);

      // обновляем активные элементы
      $wrapper.find('.js-tab-trigger').addClass('no-active').removeClass('active');
      $(this).addClass('active').removeClass('no-active');

      $wrapper.find('.js-tab-content').removeClass('active');
      $content.addClass('active');
    }
  });

  // Наведение на блок по умолчанию (возврат состояния)
  $('.sustainability-item-default').hover(function () {
    if ($(window).width() >= 992) {
      var $wrapper = $(this).parents('.sustainability-wrapper');
      $wrapper.find('.sustainability-content').stop(true, true).fadeIn(200);
      $wrapper.find('.js-tab-trigger').removeClass('active no-active');
      $wrapper.find('.js-tab-content').removeClass('active');
    }
  });

  // Уход мыши со всей области wrapper
  $(".sustainability-wrapper").on("mouseleave", function () {
    if ($(window).width() >= 992) {
      var $wrapper = $(this);

      hideTimeout = setTimeout(function () {
        $wrapper.find('.js-tab-trigger').removeClass('no-active active');
        $wrapper.find('.js-tab-content').removeClass('active');
        $wrapper.find('.sustainability-content').stop(true, true).fadeIn(200);
      }, 100);
    }
  });
});



// mouse animate (smooth Centersvet-style)
$(function () {
  const canvas = $('#mouseCanvas')[0];
  const ctx = canvas.getContext('2d', { alpha: true });

  let W = window.innerWidth;
  let H = window.innerHeight;
  let DPR = window.devicePixelRatio || 1;

  function resize() {
    DPR = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    $(canvas).css({ width: W, height: H });
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  $(window).on('resize', resize);

  const TRAIL_LENGTH = 20;   // длина плавного следа
  const LINE_WIDTH = .8;      // толщина линии
  const COLOR = 'rgba(29,33,38,1)'; // цвет линии

  const trail = [];
  let targetX = W / 2;
  let targetY = H / 2;
  let smoothX = targetX;
  let smoothY = targetY;
  const easing = 0.25; // плавность догоняющего движения

  $(window).on('pointermove', function (e) {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);

    // Плавное движение “хвоста”
    smoothX += (targetX - smoothX) * easing;
    smoothY += (targetY - smoothY) * easing;

    // добавляем новые точки
    trail.push({ x: smoothX, y: smoothY });
    if (trail.length > TRAIL_LENGTH) trail.shift();

    // Рисуем мягкую линию
    if (trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length - 2; i++) {
        const xc = (trail[i].x + trail[i + 1].x) / 2;
        const yc = (trail[i].y + trail[i + 1].y) / 2;
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      }
      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);

      // плавное исчезание — прозрачность уменьшается ближе к мышке
      const gradient = ctx.createLinearGradient(
        trail[0].x,
        trail[0].y,
        trail[trail.length - 1].x,
        trail[trail.length - 1].y
      );
      gradient.addColorStop(0, 'rgba(29,33,38,0)');
      gradient.addColorStop(0.2, 'rgba(29,33,38,0.3)');
      gradient.addColorStop(0.6, 'rgba(29,33,38,0.8)');
      gradient.addColorStop(1, 'rgba(29,33,38,1)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 0;
      ctx.stroke();
    }
  }

  draw();
});
// mouse animate end

// animate section scroll
AOS.init({
  duration: 1000, // скорость анимации
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
  if ($el.data('letters-split')) return;
  const nodes = $el.contents().toArray();
  $el.empty();

  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ') {
          $el.append(document.createTextNode(' '));
        } else if (ch === '\u00A0') {
          $el.append(document.createTextNode('\u00A0'));
        } else if (ch === '\n' || ch === '\r') {
          // ignore
        } else {
          const $span = $('<span>').text(ch);
          $el.append($span);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'br') {
      $el.append('<br>');
    } else {
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

  // Отмечаем что сплит выполнен
  $el.data('letters-split', true);

  // ВАЖНО: показываем контейнер сразу после разбивки, 
  // чтобы не было мелькания исходного текста.
  // Буквы внутри при этом остаются hidden (opacity:0) и проявятся при анимации.
  $el.addClass('ready');
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

$('.team-slider').slick({
  slidesToShow: 3,
  appendArrows: '.team-slider__nav',
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

$('.certificates-slider').slick({
  slidesToShow: 4,
  appendArrows: '.certificates-slider__nav',
  prevArrow: '<button type="button" class="slick-prev"><svg class="svg-icon"><use xlink:href="img/sprite.svg#arrow-left"></use></svg></button>',
  nextArrow: '<button type="button" class="slick-next"><svg class="svg-icon"><use xlink:href="img/sprite.svg#arrow-right"></use></svg></button>',
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      }
    },
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
$(function () {
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
  $areas.on('mouseenter', function (e) {
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
  $areas.on('mousemove', function (e) {
    placeTooltip($tooltip, e.pageX, e.pageY);
  });

  // Уход
  $areas.on('mouseleave', function (e) {
    $(this).removeClass('highlight');
    $tooltip.stop(true, true).fadeOut(80);
  });

  // На touch-устройствах: показываем по touchstart, скрываем по touchend
  $areas.on('touchstart', function (e) {
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

  $(document).on('touchend touchcancel', function () {
    $areas.removeClass('highlight');
    $tooltip.hide();
  });
});

// preloader
$(document).ready(function() {
  $('body').addClass('no-scroll'); // блокируем скролл

  // показываем прелоадер минимум 2 секунды
  setTimeout(function() {
    $('.preloader').addClass('hide'); // плавное скрытие

    // удаляем после анимации
    setTimeout(function() {
      $('.preloader').remove();
      $('body').removeClass('no-scroll'); // возвращаем скролл
    }, 600); // совпадает с transition: 0.6s
  }, 2000);
});


