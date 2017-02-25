function setScreenSize(){
    let screens = $('.screen');
    let content = $('#content');
    if(screens.length > 0){
      $(content).css({'width':(100*screens.length) + '%'});
    }
}

$(document).ready(()=>{
    setScreenSize();
});
