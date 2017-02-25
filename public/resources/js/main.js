'use strict';

function setScreenSize() {
    var screens = $('.screen');
    var content = $('#content');
    if (screens.length > 0) {
        $(content).css({ 'width': 100 * screens.length + '%' });
    }
}

$(document).ready(function () {
    setScreenSize();
});