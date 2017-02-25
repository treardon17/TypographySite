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

        this.currentPage = null;
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
            this.currentPage = $(page);
        }
    }, {
        key: 'moveElementIntoView',
        value: function moveElementIntoView() {
            var _this2 = this;

            var pObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { element: null, animated: true, callback: function callback() {} };

            if (pObject.element === null) {
                return;
            }

            var animationTime = pObject.animated ? 800 : 0;
            var windowTop = $(window).scrollTop();
            var windowLeft = $(window).scrollLeft();
            var top = $(pObject.element).offset().top;
            var left = $(pObject.element).offset().left;

            var completion = function completion() {
                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = $(pObject.element).attr('id') ? '#' + $(pObject.element).attr('id') : '';
                _this2.currentPage = $(window.location.hash);
                // Call the callback function
                if (typeof pObject.callback === 'function') {
                    pObject.callback();
                }
            };

            //get the number of pages on the current content row
            var container = $(this.currentPage).closest('.content-row');
            var numPages = $(container).find('.screen').length;

            //get the number of pages on the next content row
            container = $(pObject.element).closest('.content-row');
            var numNextPages = $(container).find('.screen').length;

            this.scrollToPos({ duration: animationTime, left: left, top: top, verticalFirst: numPages <= numNextPages });
        }
    }, {
        key: 'scrollToPos',
        value: function scrollToPos() {
            var pObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { duration: 0, left: 0, right: 0, verticalFirst: true, callback: function callback() {} };

            var windowTop = $(window).scrollTop();
            var windowLeft = $(window).scrollLeft();
            var topChange = windowTop !== pObject.top;
            var leftChange = windowLeft !== pObject.left;
            var scroller = '#content, body';

            //if our current position is diagonal from the destination
            //  we want the animation to still be the same length (even though there are two animations)
            //  so we cut the animation time for both animations in half
            if (topChange && leftChange) {
                pObject.duration = pObject.duration / 2;
            }

            if (pObject.verticalFirst) {
                $(scroller).animate({
                    scrollTop: pObject.top
                }, topChange ? pObject.duration : 0, function () {
                    $(scroller).animate({
                        scrollLeft: pObject.left
                    }, leftChange ? pObject.duration : 0, function () {
                        if (typeof pObject.callback === 'function') {
                            pObject.callback();
                        }
                    });
                });
            } else {
                $(scroller).animate({
                    scrollLeft: pObject.left
                }, leftChange ? pObject.duration : 0, function () {
                    $(scroller).animate({
                        scrollTop: pObject.top
                    }, topChange ? pObject.duration : 0, function () {
                        if (typeof pObject.callback === 'function') {
                            pObject.callback();
                        }
                    });
                });
            }
        }
    }, {
        key: 'handleNavigate',
        value: function handleNavigate(event) {
            // Make sure this.hash has a value before overriding default behavior
            if (event.target.hash !== "") {
                // Prevent default anchor click behavior
                event.preventDefault();
                // Move that page into view
                this.moveElementIntoView({ element: event.target.hash, animated: true });
            }
        }
    }]);

    return NavBar;
}();

$(document).ready(function () {
    var navBar = new NavBar();
});