$(document).ready(()=>{
    let navBar = new NavBar();
    navBar.load({callback:()=>{
        $('body').removeClass('hidden');
    }});
});
