// Application Scripts:
// Запускаем мобильное меню

jQuery(document).ready(function ($) {
    //Кэшируем
    var $window = $(window),
        $body = $('body'),
        BREAKPOINT = 992;

    //
    // Запускаем мобильное меню
    //---------------------------------------------------------------------------------------
    function initMobileMenu() {
        $body.append('<div class="overlay" id="overlay"></div>'); //добавили в документ Оверлей
        var $btn = $('.js-mtoggle'),
            $menu = $('.js-mmenu'),
            $overlay = $('#overlay');


        $('.header__main').on('click', '.js-mtoggle', function () {//покажем - спрячем
            if ($(this).hasClass('active')) {
                hideMenu();
            } else {
                showMenu();
            }
        });

        $menu.on('click', '.m-menu__label', hideMenu); //закроем по клику по заголовку

        function hideMenu() {
            $btn.removeClass('active');
            $menu.removeClass('active');
            $overlay.unbind('click', hideMenu).hide();
        }

        function showMenu() {
            $btn.addClass('active');
            $menu.addClass('active');
            $overlay.show();
        }

        $menu.mouseleave(function () {//будем закрывать по клику на оверлей
            $overlay.bind('click', hideMenu)
        }).mouseenter(function () {
            $overlay.unbind('click', hideMenu);
        });
    }
    initMobileMenu();
   
    
    //
    // Бэкграунд-слайдер
    //---------------------------------------------------------------------------------------
    function initMainSlider() {
        var winW = verge.viewportW(),
            $slider = $('.js-mslider'),
            flag = false;

        if (winW >= BREAKPOINT) { startSlider(); }//будем запускать слайдер только на десктопе

        function startSlider() {
            $slider.bxSlider({
                auto: true,
                pause:5000,
                mode: 'fade',
                touchEnabled: false,
                pager: false,
                controls: false,
            });
            flag = true;
        }

        $window.on('resize', function () {
            setTimeout(400, checkWindowSize());//при изменении размера окна вырубаем или запускаем слайдер
        });
        
        function checkWindowSize() {
            winW = verge.viewportW();
            if (flag) {//изменился размер окна, слайдер запущен
                if (winW < BREAKPOINT) {//перешли с большога экрана на маленький - вырубаем слайдер
                    $slider.destroySlider();
                    flag = false;
                }
            } 

            if (!flag) {//изменился размер окна, слайдер не был запущен
                if (winW >= BREAKPOINT) {
                    startSlider();
                }
            }
        }

        if ($('html').hasClass('lt-ie9')) {//костыль для ие8
            $('.s-nav__item:nth-child(3n-2)').addClass('first');
        }
    }
    if ($('.js-mslider').length) { initMainSlider(); }

    //
    // Фиксируем хидер при скролле
    //---------------------------------------------------------------------------------------
    function stickyHeader() {
        var $header = $('.js-header');
        $header.wrap('<div class="header__wrap"></div>');
        var $wrap = $header.parent('div'),
            flag = false,
            activeClass = 'scrolled',
            topOffset = 48, //высота десктоп-меню
            $slider_search=$('.s-search'),
            isStick = verge.inViewport($wrap, -topOffset);

        //проверим скролл при загрузке страницы
        if (!isStick) {
            $header.addClass(activeClass);
            $wrap.addClass(activeClass);
            $slider_search.addClass(activeClass);
            flag = true;
        }

        $window.on('scroll', function () {
            isStick = verge.inViewport($wrap, -topOffset);

            if (!isStick && !flag) {
                $header.addClass(activeClass);
                $wrap.addClass(activeClass);
                $slider_search.addClass(activeClass);
                flag = true;
                console.log('isStick: ' + isStick + 'flag: ' + flag);
            }

            if (isStick && flag) {
                $header.removeClass(activeClass);
                $wrap.removeClass(activeClass);
                $slider_search.removeClass(activeClass);
                flag = false;
                console.log('isStick: ' + isStick + 'flag: ' + flag);
            }
        });
    }
    stickyHeader();

    //
    // Если о плейсхолдерах не слышали
    //---------------------------------------------------------------------------------------
    if (!Modernizr.input.placeholder) {

        $('[placeholder]').focus(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
        $('[placeholder]').parents('form').submit(function () {
            $(this).find('[placeholder]').each(function () {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            })
        });
    };
});
