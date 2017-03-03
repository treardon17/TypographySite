class ExampleWriter{
    constructor(){
        // this.wordArray = ['welcome', 'to', 'cantor'];
        this.writeToScreen()
    }

    writeToScreen(){
        this.writeAndRemoveWordArray({array: ['welcome', 'to', 'cantor'], timeBetweenWords: 1000, timeBetweenLetters: 300, callback:()=>{
            this.writeToScreen();
            }
        });
    }

    writeAndRemoveWordArray(pObject = {array: [], timeBetweenWords: 0, timeBetweenLetters: 0, callback: ()=>{}}){
        if(pObject.array.length == 0){
            if(typeof pObject.callback === 'function'){
                pObject.callback();
            }
            return;
        }

        this.writeAndRemoveWord({word: pObject.array[0], timeBetweenLetters: pObject.timeBetweenLetters, timeBetweenWords: pObject.timeBetweenWords, callback: ()=>{
            let slicedArray = pObject.array.slice(1, pObject.array.length);
            this.writeAndRemoveWordArray({array: slicedArray, timeBetweenWords: pObject.timeBetweenWords, timeBetweenLetters: pObject.timeBetweenLetters, callback: pObject.callback})
        }});
    }

    writeAndRemoveWord(pObject = {word: '', timeBetweenLetters: 0, timeBetweenWords: 0, callback:()=>{}}){
        this.writeWordToElement({element: '#example-text-writer', word: pObject.word, timeBetween: pObject.timeBetweenLetters*(2/3), callback: ()=>{
            setTimeout(()=>{
                this.removeWordFromElement({element: '#example-text-writer', timeBetween: pObject.timeBetweenLetters*(1/3), callback: pObject.callback});
            }, pObject.timeBetweenWords);
        }});
    }

    writeWordToElement(pObject = {element: null, word: '', timeBetween: 0, callback: ()=>{}}){
        let element = $(pObject.element);
        let word = pObject.word;
        if(element === null || word === null || word === '')
            return;

        for(let i = 0; i < word.length; i++){
            let partial = word.slice(0,i+1);
            setTimeout(()=>{
                $(element).text(partial);
            }, pObject.timeBetween*i);
        }

        if(typeof pObject.callback === 'function'){
            setTimeout(()=>{
                pObject.callback();
            }, pObject.timeBetween*word.length);
        }
    }

    removeWordFromElement(pObject = {element: null, timeBetween: 0, callback: ()=>{}}){
        let element = $(pObject.element);
        if(element === null)
            return;

        let word = $(element).text();
        for(let i = word.length; i >= 0; i--){
            let partial = word.slice(0,i);
            setTimeout(()=>{
                $(element).text(partial);
            }, pObject.timeBetween*(word.length-i));
        }

        if(typeof pObject.callback === 'function'){
            setTimeout(()=>{
                pObject.callback();
            }, pObject.timeBetween*word.length);
        }
    }
}

$(document).ready(()=>{
    let writer = new ExampleWriter();
});
