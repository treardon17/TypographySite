$(document).ready(()=>{
    requirejs(['./resources/js/nav-bar.js'], function(){
        let navBar = new NavBar();
        navBar.load({callback:()=>{
            $('body').removeClass('hidden');
        }});
    });
});
