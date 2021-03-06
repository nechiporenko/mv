// Application Scripts:

// Запускаем мобильное меню
// Бэкграунд-слайдер
// Слайдер новостей
// Фиксируем хидер при скролле
// Покажем - спрячем форму поиска в десктоп-меню по клику на кнопку
// Выпадающее десктоп-меню
// Меняем размер шрифта
// Автовыравнивание блоков по высоте
// "Плавающее" боковое меню
// Если о плейсхолдерах не слышали
// Если плохой браузер

jQuery(document).ready(function ($) {
    //Кэшируем
    var $window = $(window),
        $html=$('html'),
        $body = $('body'),
        BREAKPOINT = 992;

    //
    // Запускаем мобильное меню
    //---------------------------------------------------------------------------------------
    function initMobileMenu() {
        $body.append('<div class="overlay" id="overlay"></div>'); //добавили в документ Оверлей
        var $btn = $('.js-mtoggle'),
            $menu = $('.js-mmenu'),
            $submenu=$menu.find('.m-submenu'),
            $overlay = $('#overlay');

        $menu.find('li').has('ul').children('a').addClass('has-menu');
        var $s_btn = $menu.find('.has-menu'); //заголовки суб-меню

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
            hideSubMenu();
            $html.css('overflow', 'auto');
            $overlay.unbind('click', hideMenu).hide();
        }

        function showMenu() {
            $btn.addClass('active');
            $menu.addClass('active');
            $html.css('overflow', 'hidden');
            $overlay.show();
        }

        $menu.mouseleave(function () {//будем закрывать по клику на оверлей
            $overlay.bind('click', hideMenu)
        }).mouseenter(function () {
            $overlay.unbind('click', hideMenu);
        });


        $menu.on('click', '.has-menu', function (e) {//покажем - спрячем подменю
            e.preventDefault();
            var $el = $(this);
            if ($el.hasClass('active')) {
                hideSubMenu();
            } else {
                hideSubMenu();
                $el.addClass('active').parent('li').find('ul').slideDown();
            }
        });

        function hideSubMenu() {
            $s_btn.removeClass('active');
            $submenu.slideUp();
        }
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
    // Слайдер новостей
    //---------------------------------------------------------------------------------------
    function initNewsSlider() {
        var $slider = $('.js-topnews').bxSlider({
            auto: true,
            pause: 5000,
            mode: 'fade',
            autoHover:true
        });
    }
    if ($('.js-topnews').length) { initNewsSlider();}

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
            }

            if (isStick && flag) {
                $header.removeClass(activeClass);
                $wrap.removeClass(activeClass);
                $slider_search.removeClass(activeClass);

                if ($header.hasClass('compact')) {//если открыта форма поиска в хидере - закроем
                    headerSearch.close();
                }

                flag = false;
            }
        });
    }
    stickyHeader();

    //
    // Покажем - спрячем форму поиска в десктоп-меню по клику на кнопку
    //---------------------------------------------------------------------------------------
    var headerSearch=(function(){
        var $btn=$('.js-search-toggle'),
            $target = $('.h-search'),
            $header = $('.js-header'),
            method = {};

        $('.js-menu').on('click', '.js-search-toggle', function () {
            topMenu.close();//если открыто десктоп субменю - скроем
            if ($(this).hasClass('active')) {
                method.close();
            } else {
                method.show();
            }
        });

        method.show=function(){
            $btn.addClass('active');
            $target.addClass('active');
            $header.addClass('compact');//уменьшим расстояние между пунктами первого уровня десктоп-меню
        }
        method.close=function(){
            $btn.removeClass('active');
            $target.removeClass('active');
            $header.removeClass('compact');
        }
        return method;
    })();

    //
    // Выпадающее десктоп-меню
    //---------------------------------------------------------------------------------------
    var topMenu = (function () {
        var $menu = $('.js-menu'),
            $btn = $menu.children('li').children('a'),
            $submenu = $menu.find('.submenu'),
            $overlay = $('#overlay'),
            method = {};

        $menu.find('li').has('ul').children('a').addClass('has-menu');

        $menu.on('click', '.has-menu', function (e) {
            e.preventDefault();
            headerSearch.close();//если открыта форма поиска - закроем
            if ($(this).hasClass('active')) {//кликаем по активному пункту - сворачиваем
                $submenu.slideUp();
                $btn.removeClass('active');
                $overlay.removeClass('half').unbind('click', method.close).hide();
            } else {//спрячем (если открыты) активные подменю, развернем текущее
                var $el = $(this);
                method.close();
                $el.addClass('active').parent('li').find('.submenu').slideDown();
                $overlay.addClass('half').show(); //накрыли контент оверлеем
            }
        });

        $menu.mouseleave(function () {//закроем подменю по клику на оверлей
            $overlay.bind('click', method.close);
        }).mouseenter(function () {
            $overlay.unbind('click', method.close);
        });

        if ($html.hasClass('lt-ie9')) {//плохой браузер
            $submenu.find('li:nth-child(3n)').addClass('last');
        }

        method.close = function () {
            $submenu.hide();
            $btn.removeClass('active');
            $overlay.removeClass('half').unbind('click', method.close).hide();
        }
        return method;
    })();
   

    //
    // Боковое меню (аккордеон)
    //---------------------------------------------------------------------------------------
    function initSideMenu() {
        var $menu = $('.js-sidenav');
        $menu.children('li').has('ul').children('a').addClass('has-menu');

        var $btn = $menu.find('.has-menu');

        //если передан активный класс линку при загрузке страницы - раскроем соотв.подменю
        $btn.each(function () {
            if ($(this).hasClass('active')) {
                $(this).next('ul').show();
            }
        });

        $menu.on('click', '.has-menu', function (e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {//скрываем, если меню фиксировано - пересчитываем размеры
                $(this).removeClass('active').next('ul').slideUp(400, function () { stickySideMenu.recalc(); });
            } else {//раскроем
                $(this).addClass('active').next('ul').slideDown(400, function () { stickySideMenu.recalc(); });
            }
        });
    }
    if ($('.js-sidenav').length) { initSideMenu();}

    //
    // Меняем размер шрифта
    //---------------------------------------------------------------------------------------
    function changeFontSize() {
        var $target = $('.js-fns-target'),
            fontsize = 100;
        $('.js-fns').on('click', 'button', function () {
            if ($(this).hasClass('h-fonzize__btn--lg')) {//увеличиваем шрифт
                fontsize = fontsize + 12.5;
                changeFont();
            } else {//уменьшаем шрифт
                if (fontsize === 100) { //не уменьшаем меньше исходного
                    return false;
                } else {
                    fontsize = fontsize - 12.5;
                    changeFont();
                }
            }
        });

        function changeFont() {
            $target.each(function () {
                $(this).css('font-size', fontsize + '%');
            });
        }
    }
    changeFontSize();

    //
    // Автовыравнивание блоков по высоте
    //---------------------------------------------------------------------------------------
    $('.js-match-height').matchHeight();

    //
    // "Плавающее" боковое меню
    //---------------------------------------------------------------------------------------
    var stickySideMenu = (function () {
        var stick_breakpoint = 768, //на меньших экранах - будем отключать
            top_offset = 63, //48 - высота десктоп-меню + отступ
            winW = verge.viewportW(),
            flag = false, //статус - фиксировано или нет
            $menu = $('.js-stick'),
            method = {};

        method.stick = function () {
            $menu.stick_in_parent({//фиксируем
                parent: $('.js-stick').parents('.g-container'),
                offset_top: top_offset
            });
            flag = true;
        }

        method.unstick = function () {
            $menu.trigger('sticky_kit:detach');
            flag = false;
        }

        method.recalc = function () {//если раскрыли - скрыли подменю и меню фиксировано - пересчитаем размер, чтобы убрать "прыжки" при скролле
            if (flag) {
                $menu.trigger('sticky_kit:recalc');
            }
        }

        method.checkout = function () {
            winW = verge.viewportW();
            if (winW >= 768 && !flag) {
                method.stick();
            }
            if (winW < 768 && flag) {
                method.unstick();
            }
        }

        method.checkout();//проверили на старте
        $window.on('resize', function () {//проверили при ресайзе
            setTimeout(method.checkout, 500);
        });

        return method;
    })();

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

    //
    // Если плохой браузер
    //---------------------------------------------------------------------------------------
    if ($('html').hasClass('lt-ie9')) {
        $('.service__item:nth-child(2n-1)').addClass('first');
    }
});
