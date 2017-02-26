function setScreenSize(){
    let screens = $('.content-row').first().find('.screen');
    let content = $('#content');
    if(screens.length > 0){
      $(content).css({'width':(100*screens.length) + 'vw'});
    }
}

$(document).ready(()=>{
    setScreenSize();
});
