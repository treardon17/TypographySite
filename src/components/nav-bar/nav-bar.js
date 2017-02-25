class NavBar{
    constructor(){
        this.pageContent = $('#content');
        this.screens = $('.screen');
        this.navButtons = $('.nav-bar-item');
        this.setUpListeners();
        this.setCurrentPage({animated: false});
    }

    setUpListeners(){
        $(this.navButtons).click((event)=>{
            this.handleNavigate(event);
        });

        $(window).on('popstate', ()=>{
            this.setCurrentPage({animated: true});
        });
    }

    setCurrentPage(pObject = {animated: true}){
        let page = window.location.hash;
        if(page === ''){
            page = '#home'
        }
        this.moveElementIntoView({element: $(page), animated:pObject.animated});
    }

    moveElementIntoView(pObject = {element: null, animated: true, callback:()=>{}}){
        let animationTime = pObject.animated ? 800 : 0;
        const top = $(pObject.element).offset().top;
        const left = $(pObject.element).offset().left;
        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('#content, body').animate({
            scrollTop: top,
            scrollLeft: left
        }, animationTime, function(){
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = $(pObject.element).attr('id') ? '#'+$(pObject.element).attr('id') : '';
            // Call the callback function
            if(typeof pObject.callback === 'function'){
                pObject.callback();
            }
        });
    }

    handleNavigate(event){
        // Make sure this.hash has a value before overriding default behavior
        if (event.target.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            let hash = event.target.hash;

            this.moveElementIntoView({element: hash, animated: true});
        }
    }
}

$(document).ready(()=>{
    let navBar = new NavBar();
});
