'use strict';

$(document).ready(function () {
    requirejs(['./resources/js/nav-bar.js'], function () {
        var navBar = new NavBar();
        navBar.load({ callback: function callback() {
                $('body').removeClass('hidden');
            } });
    });
});