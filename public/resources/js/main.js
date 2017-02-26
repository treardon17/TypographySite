'use strict';

function setScreenSize() {
    var screens = $('.content-row').first().find('.screen');
    var content = $('#content');
    if (screens.length > 0) {
        $(content).css({ 'width': 100 * screens.length + 'vw' });
    }
}

$(document).ready(function () {
    setScreenSize();
});