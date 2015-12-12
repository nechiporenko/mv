// Application Scripts:
// Запускаем мобильное меню

jQuery(document).ready(function ($) {
    //Кэшируем
    var $window = $(window),
        $body = $('body');

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
   
    

    

    
});
