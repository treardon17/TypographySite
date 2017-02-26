'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FancyTextBox = function () {
    function FancyTextBox(element) {
        _classCallCheck(this, FancyTextBox);

        this.textBox = element;
        this.placeholder = $(element).find('.fancy-text-box-placeholder')[0];
        this.inputBox = $(element).find('.fancy-text-box-input')[0];
        this.smallPlaceHolderClass = 'fancy-text-box-placeholder-small fancy-text-box-placeholder-origin';
        this.setupTextBox();
    }

    _createClass(FancyTextBox, [{
        key: 'shrinkPlaceholder',
        value: function shrinkPlaceholder() {
            $(this.placeholder).addClass(this.smallPlaceHolderClass);
        }
    }, {
        key: 'growPlaceholder',
        value: function growPlaceholder() {
            $(this.placeholder).removeClass(this.smallPlaceHolderClass);
        }
    }, {
        key: 'handleBoxFocusOut',
        value: function handleBoxFocusOut() {
            var textBoxValue = $(this.inputBox).val();
            //if the textbox has nothing in it when the user drops focus
            //make things go back to the original state
            if (textBoxValue === "") {
                $(this.placeholder).removeClass(this.smallPlaceHolderClass);
            }
        }
    }, {
        key: 'handleBoxFocusIn',
        value: function handleBoxFocusIn() {
            $(this.placeholder).addClass(this.smallPlaceHolderClass);
        }

        //set up event handlers

    }, {
        key: 'setupTextBox',
        value: function setupTextBox() {
            var _this = this;

            $(this.inputBox).focus(function (event) {
                _this.handleBoxFocusIn();
            });

            $(this.inputBox).focusout(function (event) {
                _this.handleBoxFocusOut();
            });

            $(this.placeholder).click(function () {
                $(_this.inputBox).focus();
            });
        }
    }]);

    return FancyTextBox;
}();

$(document).ready(function () {
    var textBoxes = $('.fancy-text-box');
    for (var i = 0; i < textBoxes.length; i++) {
        new FancyTextBox(textBoxes[i]);
    }
});