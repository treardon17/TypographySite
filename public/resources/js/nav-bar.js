'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavBar = function () {
    function NavBar() {
        _classCallCheck(this, NavBar);

        this.navButtons = $('.nav-bar-item');
        this.navButtonContainers = $('.nav-item-container');
        this.pageContent = $('#content');
        this.contentRows = $('.content-row');

        //make a grid of screens
        //  note: each content-row must have the same number of screens.
        //  if there are not enough screens, enter an 'empty-screen' to fill the space
        this.screenGrid = [];
        for (var i = 0; i < this.contentRows.length; i++) {
            this.screenGrid[i] = $(this.contentRows[i]).find('.screen');
        }

        this.currentScreenPos = { row: 0, col: 0 };
        this.currentPage = null;
        this.setCurrentPage({ animated: false });
        this.setUpListeners();
    }

    _createClass(NavBar, [{
        key: 'setUpListeners',
        value: function setUpListeners() {
            var _this = this;

            $(this.navButtons).click(function (event) {
                _this.handleNavigate(event);
            });

            window.onpopstate = function () {
                _this.setCurrentPage({ animated: true });
            };
        }
    }, {
        key: 'setCurrentScreenPos',
        value: function setCurrentScreenPos() {
            if (!this.currentPage) {
                console.log("current page not defined");
                return;
            }

            for (var row = 0; row < this.screenGrid.length; row++) {
                for (var col = 0; col < this.screenGrid[row].length; col++) {
                    if ($(this.currentPage).attr('id') === $(this.screenGrid[row][col]).attr('id')) {
                        this.currentScreenPos = { row: row, col: col };
                        return;
                    }
                }
            }
        }
    }, {
        key: 'setMenuItemsForCurrentPos',
        value: function setMenuItemsForCurrentPos() {
            var info = this.getNavBarMenuInfoForGridPos(this.currentScreenPos);
            this.setMenuItem({ selector: '#nav-item-left', href: info.left.href, name: info.left.name });
            this.setMenuItem({ selector: '#nav-item-right', href: info.right.href, name: info.right.name });
            this.setMenuItem({ selector: '#nav-item-top', href: info.top.href, name: info.top.name });
            this.setMenuItem({ selector: '#nav-item-bottom', href: info.bottom.href, name: info.bottom.name });
        }
    }, {
        key: 'setMenuItem',
        value: function setMenuItem() {
            var pObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { selector: "", href: "", name: "" };

            var item = $(pObject.selector);
            $(item).text(pObject.name);
            $(item).attr('href', pObject.href);
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
            this.currentPage = $(page).first();
        }
    }, {
        key: 'moveElementIntoView',
        value: function moveElementIntoView() {
            var _this2 = this;

            var pObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { element: null, animated: true, callback: function callback() {} };

            if (pObject.element === null) return;

            var animationTime = pObject.animated ? 800 : 0;
            var top = $(pObject.element).position().top;
            var left = $(pObject.element).position().left;

            var completion = function completion() {
                // Add hash (#) to URL when done scrolling (default click behavior)
                // window.location.hash = $(pObject.element).attr('id') ? '#'+$(pObject.element).attr('id') : '';
                _this2.currentPage = $(pObject.element);
                _this2.setCurrentScreenPos();
                _this2.setMenuItemsForCurrentPos();
                // Call the callback function
                if (typeof pObject.callback === 'function') {
                    pObject.callback();
                }
            };

            // //get the number of pages on the current content row
            // let container = $(this.currentPage).closest('.content-row');
            // const numPages = $(container).find('.screen :not(.empty-screen)').length;
            //
            // //get the number of pages on the next content row
            // container = $(pObject.element).closest('.content-row');
            // const numNextPages = $(container).find('.screen :not(.empty-screen)').length;

            // this.scrollToPos({duration: animationTime, left: left, top: top, verticalFirst: numPages <= numNextPages, callback: completion});
            this.scrollToPos({ duration: animationTime, left: left, top: top, callback: completion });
        }
    }, {
        key: 'scrollToPos',
        value: function scrollToPos() {
            var _this3 = this;

            var pObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { duration: 0, left: 0, top: 0, callback: function callback() {} };

            var windowTop = $(window).scrollTop();
            var windowLeft = $(window).scrollLeft();
            var topChange = windowTop !== pObject.top;
            var leftChange = windowLeft !== pObject.left;

            $('#viewport-content').addClass('content-scaled');
            $(this.navButtonContainers).addClass('hidden');
            setTimeout(function () {
                $('#viewport-content').removeClass('content-scaled');
                $(_this3.navButtonContainers).removeClass('hidden');
            }, 700);
            $('#content').css({ 'margin-top': -pObject.top + 'px', 'margin-left': -pObject.left + 'px' });
            setTimeout(pObject.callback, 1000);
        }
    }, {
        key: 'checkScreenGridOutOfBounds',
        value: function checkScreenGridOutOfBounds() {
            var coord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { row: 0, col: 0 };

            //make sure our indices are not out of bounds
            if (coord == null || coord.row < 0 || coord.row >= this.screenGrid.length || this.screenGrid.length == 0 || coord.col < 0 || coord.col >= this.screenGrid[0].length || this.screenGrid[0].length == 0) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'getNavBarMenuInfoForGridPos',
        value: function getNavBarMenuInfoForGridPos() {
            var gridPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { row: 0, col: 0 };

            if (this.checkScreenGridOutOfBounds(gridPos)) return null;

            var leftCoord = gridPos.col - 1 >= 0 ? { row: gridPos.row, col: gridPos.col - 1 } : null;
            var topCoord = gridPos.row - 1 >= 0 ? { row: gridPos.row - 1, col: gridPos.col } : null;
            var rightCoord = gridPos.col + 1 <= this.screenGrid[0].length - 1 ? { row: gridPos.row, col: gridPos.col + 1 } : null;
            var bottomCoord = gridPos.row + 1 <= this.screenGrid.length - 1 ? { row: gridPos.row + 1, col: gridPos.col } : null;

            var coords = {
                top: this.coordPointingToValidScreen(topCoord) ? this.getInfoForScreenAtCoord(topCoord) : this.getInfoForValidScreenForRow(topCoord),
                bottom: this.coordPointingToValidScreen(bottomCoord) ? this.getInfoForScreenAtCoord(bottomCoord) : this.getInfoForValidScreenForRow(bottomCoord),
                right: this.coordPointingToValidScreen(rightCoord) ? this.getInfoForScreenAtCoord(rightCoord) : this.getInfoForValidScreenForCol(rightCoord),
                left: this.coordPointingToValidScreen(leftCoord) ? this.getInfoForScreenAtCoord(leftCoord) : this.getInfoForValidScreenForCol(leftCoord)
            };

            return coords;
        }
    }, {
        key: 'coordPointingToValidScreen',
        value: function coordPointingToValidScreen() {
            var coord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { row: 0, col: 0 };

            if (this.checkScreenGridOutOfBounds(coord) || coord == null) return false;

            var element = this.screenGrid[coord.row][coord.col];
            //if it's not an empty screen and it is a screen, we're good
            if (!$(element).hasClass('empty-screen') && $(element).hasClass('screen')) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'getInfoForValidScreenForRow',
        value: function getInfoForValidScreenForRow() {
            var coord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { row: 0, col: 0 };

            var newCoord = this.getCoordForValidScreenForRow(coord);
            return this.getInfoForScreenAtCoord(newCoord);
        }
    }, {
        key: 'getCoordForValidScreenForRow',
        value: function getCoordForValidScreenForRow() {
            var coord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { row: 0, col: 0 };

            //make sure we're not going out of bounds
            if (this.checkScreenGridOutOfBounds(coord)) return null;

            for (var col = 0; col < this.screenGrid[coord.row].length; col++) {
                var screen = $(this.screenGrid[coord.row][col]);
                //if it is a valid screen
                if (!$(screen).hasClass('empty-screen')) {
                    return { row: coord.row, col: col };
                }
            }
            //we didn't find anything
            return null;
        }
    }, {
        key: 'getInfoForValidScreenForCol',
        value: function getInfoForValidScreenForCol() {
            var coord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { row: 0, col: 0 };

            var newCoord = this.getCoordForValidScreenForCol(coord);
            return this.getInfoForScreenAtCoord(newCoord);
        }
    }, {
        key: 'getCoordForValidScreenForCol',
        value: function getCoordForValidScreenForCol() {
            var coord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { row: 0, col: 0 };

            //make sure we're not going out of bounds
            if (this.checkScreenGridOutOfBounds(coord)) return null;

            for (var row = 0; row < this.screenGrid.length; row++) {
                var screen = $(this.screenGrid[row][coord.col]);
                //if it is a valid screen
                if (!$(screen).hasClass('empty-screen')) {
                    return { row: row, col: coord.col };
                }
            }
            //we didn't find anything
            return null;
        }
    }, {
        key: 'getInfoForScreenAtCoord',
        value: function getInfoForScreenAtCoord() {
            var coord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { row: 0, col: 0 };

            var returnObject = { name: '', href: '' };
            if (coord != null) {
                returnObject.name = $(this.screenGrid[coord.row][coord.col]).attr('title');
                returnObject.href = '#' + $(this.screenGrid[coord.row][coord.col]).attr('id');
            }
            return returnObject;
        }
    }, {
        key: 'handleNavigate',
        value: function handleNavigate(event) {
            // Make sure this.hash has a value before overriding default behavior
            if (event.target.hash !== "") {
                // Prevent default anchor click behavior
                event.preventDefault();
                history.pushState(null, null, event.target.hash);
                this.setCurrentPage();
                // Move that page into view
                // this.moveElementIntoView({element: event.target.hash, animated: true});
            }
        }
    }]);

    return NavBar;
}();

$(document).ready(function () {
    var navBar = new NavBar();
});