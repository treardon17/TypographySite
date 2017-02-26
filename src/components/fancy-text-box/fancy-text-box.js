class FancyTextBox{
    constructor(element){
        this.textBox = element;
        this.placeholder = $(element).find('.fancy-text-box-placeholder')[0];
        this.inputBox = $(element).find('.fancy-text-box-input')[0];
        this.smallPlaceHolderClass = 'fancy-text-box-placeholder-small fancy-text-box-placeholder-origin';
        this.setupTextBox();
    }

    shrinkPlaceholder(){
        $(this.placeholder).addClass(this.smallPlaceHolderClass);
    }

    growPlaceholder(){
        $(this.placeholder).removeClass(this.smallPlaceHolderClass);       
    }

    handleBoxFocusOut(){
        const textBoxValue = $(this.inputBox).val();
        //if the textbox has nothing in it when the user drops focus
        //make things go back to the original state
        if(textBoxValue === ""){
            $(this.placeholder).removeClass(this.smallPlaceHolderClass);
        }
    }

    handleBoxFocusIn(){
        $(this.placeholder).addClass(this.smallPlaceHolderClass);
    }

    //set up event handlers
    setupTextBox(){
        $(this.inputBox).focus((event)=>{
            this.handleBoxFocusIn();
        });

        $(this.inputBox).focusout((event)=>{
            this.handleBoxFocusOut();
        });

        $(this.placeholder).click(()=>{
            $(this.inputBox).focus();
        });
    }
}

$(document).ready(()=>{
    let textBoxes = $('.fancy-text-box');
    for(let i = 0; i < textBoxes.length; i++){
        new FancyTextBox(textBoxes[i]);
    }
});