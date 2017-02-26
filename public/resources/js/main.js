'use strict';

$(document).ready(function () {
    var navBar = new NavBar();
    navBar.load({ callback: function callback() {
            $('body').removeClass('hidden');
        } });
});