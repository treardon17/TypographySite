'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParallaxPage = function () {
    function ParallaxPage() {
        _classCallCheck(this, ParallaxPage);

        this.previousTop = window.pageYOffset || document.documentElement.scrollTop;
        this.parallaxContainers = [];
        var parallaxContainers = $('.parallax-container');
        for (var i = 0; i < parallaxContainers.length; i++) {
            var parallaxElements = $(parallaxContainers[i]).find('.parallax-element');
            var titleHeadings = $(parallaxContainers[i]).find('.title-heading');
            this.parallaxContainers.push({ container: parallaxContainers[i], elements: parallaxElements, titleHeadings: titleHeadings, position: $(parallaxContainers[i]).offset().top });
        }
        //set initial position of elements
        this.handleScroll();
        this.currentScrollDirection = 0;
    }

    //This should be placed inside of a $(window).scroll(()=>{})


    _createClass(ParallaxPage, [{
        key: 'handleScroll',
        value: function handleScroll() {
            var _this = this;

            if (this.parallaxContainers.length == 0) {
                return;
            };

            var _loop = function _loop(i) {
                var container = _this.parallaxContainers[i].container;
                var elements = _this.parallaxContainers[i].elements;

                //check if the element we're observing is in the current viewport
                _this.checkElementInView(container, {
                    elementInViewCallback: function elementInViewCallback(percentComplete) {
                        var distanceToTravel = $(container).outerHeight() * 0.33;
                        _this.moveElements(elements, percentComplete * distanceToTravel);
                    }
                });
            };

            for (var i = 0; i < this.parallaxContainers.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'moveElements',
        value: function moveElements(elements, margin) {
            for (var i = 0; i < elements.length; i++) {
                $(elements[i]).css({ 'top': margin + 'px' });
            }
        }
    }, {
        key: 'opacityElements',
        value: function opacityElements(elements, opacity) {
            for (var i = 0; i < elements.length; i++) {
                $(elements[i]).css({ 'opacity': opacity });
            }
        }

        //Checks to see if an element is above, within, or below the current scroll offset

    }, {
        key: 'checkElementInView',
        value: function checkElementInView(elementSelector, cbObject) {
            var top = window.pageYOffset || document.documentElement.scrollTop; //top of the window
            var windowHeight = $(window).height();
            var bottom = top + windowHeight; //bottom of the window


            var element = $(elementSelector); //div being observed
            var height = $(element).outerHeight(); //height of the element
            var offset = $(element).offset().top; //the top of the element

            var bottomInView = bottom >= offset && bottom < offset + height;
            var topInView = top >= offset && top < offset + height;
            var aboveView = top - offset < height;
            var belowView = top > offset + height;
            var viewInViewport = bottom > offset || top < offset + height;

            //this will prevent the new top from being set 
            if (top % 2 == 0) {
                //will be -1 if scrolling down, 1 if scrolling up
                if (this.previousTop < top) {
                    this.currentScrollDirection = -1;
                } else if (this.previousTop > top) {
                    this.currentScrollDirection = 1;
                }
                //remember where the previous top is
                this.previousTop = top;
            }

            if (topInView) {
                //if the top of the viewport is in the middle of the element we're observing
                if (typeof cbObject.middleCallback === 'function') {
                    var percentComplete = (top - offset) / height;
                    cbObject.middleCallback(percentComplete);
                }
            } else if (aboveView) {
                //if the viewport is above the view we're observing
                if (typeof cbObject.aboveCallback === 'function') {
                    cbObject.aboveCallback();
                }
            } else if (belowView) {
                //if the viewport is below the view we're observing
                if (typeof cbObject.belowCallback === 'function') {
                    cbObject.belowCallback();
                }
            } else if (bottomInView) {
                //if the bottom of the window is in the middle of the element we're observing
                if (typeof cbObject.bottomProgressCallback === 'function') {
                    var _percentComplete = (bottom - offset) / height;
                    cbObject.bottomProgressCallback(_percentComplete);
                }
            }

            //if any part of the element is in the view
            if (topInView || viewInViewport || bottomInView) {
                if (typeof cbObject.elementInViewCallback === 'function') {
                    var _percentComplete2 = (top - offset) / (2 * height + windowHeight);
                    cbObject.elementInViewCallback(_percentComplete2);
                }
            }
        }
    }]);

    return ParallaxPage;
}();

//when the document has been loaded, make a parallax page
//call the handleScroll function on every scroll event


$(document).ready(function () {
    var parallax = new ParallaxPage();
    var throttledUpdate = _.throttle(function () {
        parallax.handleScroll();
    }, 10);

    $(window).scroll(function () {
        throttledUpdate();
    });
});