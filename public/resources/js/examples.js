'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExampleWriter = function () {
    function ExampleWriter() {
        _classCallCheck(this, ExampleWriter);

        this.wordArray = ['welcome', 'to', 'cantor'];
        this.writeToScreen();
    }

    _createClass(ExampleWriter, [{
        key: 'writeToScreen',
        value: function writeToScreen() {
            this.writeAndRemoveWordArray({ array: this.wordArray, timeBetweenWords: 1000, timeBetweenLetters: 300, callback: this.writeToScreen });
        }
    }, {
        key: 'writeAndRemoveWordArray',
        value: function writeAndRemoveWordArray() {
            var _this = this;

            var pObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { array: [], timeBetweenWords: 0, timeBetweenLetters: 0, callback: function callback() {} };

            if (pObject.array.length == 0) {
                if (typeof pObject.callback === 'function') {
                    pObject.callback();
                }
                return;
            }

            this.writeAndRemoveWord({ word: pObject.array[0], timeBetweenLetters: pObject.timeBetweenLetters, timeBetweenWords: pObject.timeBetweenWords, callback: function callback() {
                    var slicedArray = pObject.array.slice(1, pObject.array.length);
                    _this.writeAndRemoveWordArray({ array: slicedArray, timeBetweenWords: pObject.timeBetweenWords, timeBetweenLetters: pObject.timeBetweenLetters });
                } });
        }
    }, {
        key: 'writeAndRemoveWord',
        value: function writeAndRemoveWord() {
            var _this2 = this;

            var pObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { word: '', timeBetweenLetters: 0, timeBetweenWords: 0, callback: function callback() {} };

            this.writeWordToElement({ element: '#example-text-writer', word: pObject.word, timeBetween: pObject.timeBetweenLetters * (2 / 3), callback: function callback() {
                    setTimeout(function () {
                        _this2.removeWordFromElement({ element: '#example-text-writer', timeBetween: pObject.timeBetweenLetters * (1 / 3), callback: pObject.callback });
                    }, pObject.timeBetweenWords);
                } });
        }
    }, {
        key: 'writeWordToElement',
        value: function writeWordToElement() {
            var pObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { element: null, word: '', timeBetween: 0, callback: function callback() {} };

            var element = $(pObject.element);
            var word = pObject.word;
            if (element === null || word === null || word === '') return;

            var _loop = function _loop(i) {
                var partial = word.slice(0, i + 1);
                setTimeout(function () {
                    $(element).text(partial);
                }, pObject.timeBetween * i);
            };

            for (var i = 0; i < word.length; i++) {
                _loop(i);
            }

            if (typeof pObject.callback === 'function') {
                setTimeout(function () {
                    pObject.callback();
                }, pObject.timeBetween * word.length);
            }
        }
    }, {
        key: 'removeWordFromElement',
        value: function removeWordFromElement() {
            var pObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { element: null, timeBetween: 0, callback: function callback() {} };

            var element = $(pObject.element);
            if (element === null) return;

            var word = $(element).text();

            var _loop2 = function _loop2(i) {
                var partial = word.slice(0, i);
                setTimeout(function () {
                    $(element).text(partial);
                }, pObject.timeBetween * (word.length - i));
            };

            for (var i = word.length; i >= 0; i--) {
                _loop2(i);
            }

            if (typeof pObject.callback === 'function') {
                setTimeout(function () {
                    pObject.callback();
                }, pObject.timeBetween * word.length);
            }
        }
    }]);

    return ExampleWriter;
}();

$(document).ready(function () {
    var writer = new ExampleWriter();
});