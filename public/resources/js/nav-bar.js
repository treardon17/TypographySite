'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavBar = function () {
    function NavBar() {
        _classCallCheck(this, NavBar);

        this.pageContent = $('#content');
        this.screens = $('.screen');
        this.navButtons = $('.nav-bar-item');
        this.setUpListeners();
        this.setCurrentPage({ animated: false });
    }

    _createClass(NavBar, [{
        key: 'setUpListeners',
        value: function setUpListeners() {
            var _this = this;

            $(this.navButtons).click(function (event) {
                _this.handleNavigate(event);
            });

            $(window).on('popstate', function () {
                _this.setCurrentPage({ animated: true });
            });
        }
    }, {
        key: 'setCurrentPage',
        value: function setCurrentPage() {
            var pObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { animated: true };

            var page = window.location.hash;
            if (page === '') {
                page = '#home';
            }
            this.moveElementIntoView({ element: $(page), animated: pObject.animated });
        }
    }, {
        key: 'moveElementIntoView',
        value: function moveElementIntoView() {
            var pObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { element: null, animated: true, callback: function callback() {} };

            var animationTime = pObject.animated ? 800 : 0;
            var top = $(pObject.element).offset().top;
            var left = $(pObject.element).offset().left;
            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('#content, body').animate({
                scrollTop: top,
                scrollLeft: left
            }, animationTime, function () {
                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = $(pObject.element).attr('id') ? '#' + $(pObject.element).attr('id') : '';
                // Call the callback function
                if (typeof pObject.callback === 'function') {
                    pObject.callback();
                }
            });
        }
    }, {
        key: 'handleNavigate',
        value: function handleNavigate(event) {
            // Make sure this.hash has a value before overriding default behavior
            if (event.target.hash !== "") {
                // Prevent default anchor click behavior
                event.preventDefault();

                // Store hash
                var hash = event.target.hash;

                this.moveElementIntoView({ element: hash, animated: true });
            }
        }
    }]);

    return NavBar;
}();

$(document).ready(function () {
    var navBar = new NavBar();
});