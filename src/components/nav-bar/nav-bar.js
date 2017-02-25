class NavBar{
    constructor(){
        this.pageContent = $('#content');
        this.screens = $('.screen');
        this.navButtons = $('.nav-bar-item');
        this.setUpListeners();

        this.currentPage = null;
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
        this.currentPage = $(page);
    }

    moveElementIntoView(pObject = {element: null, animated: true, callback:()=>{}}){
        if (pObject.element === null){
            return;
        }

        let animationTime = pObject.animated ? 800 : 0;
        const windowTop = $(window).scrollTop();
        const windowLeft = $(window).scrollLeft();
        const top = $(pObject.element).offset().top;
        const left = $(pObject.element).offset().left;

        const completion = () => {
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = $(pObject.element).attr('id') ? '#'+$(pObject.element).attr('id') : '';
            this.currentPage = $(window.location.hash);
            // Call the callback function
            if(typeof pObject.callback === 'function'){
                pObject.callback();
            }
        }

        //get the number of pages on the current content row
        let container = $(this.currentPage).closest('.content-row');
        const numPages = $(container).find('.screen').length;

        //get the number of pages on the next content row
        container = $(pObject.element).closest('.content-row');
        const numNextPages = $(container).find('.screen').length;
        
        this.scrollToPos({duration: animationTime, left: left, top: top, verticalFirst: numPages <= numNextPages});
    }

    scrollToPos(pObject = {duration: 0, left:0, right:0, verticalFirst: true, callback: ()=>{}}){
        const windowTop = $(window).scrollTop();
        const windowLeft = $(window).scrollLeft();
        const topChange = windowTop !== pObject.top;
        const leftChange = windowLeft !== pObject.left;
        const scroller = '#content, body';

        //if our current position is diagonal from the destination
        //  we want the animation to still be the same length (even though there are two animations)
        //  so we cut the animation time for both animations in half
        if(topChange && leftChange){
            pObject.duration = pObject.duration/2;
        }

        if(pObject.verticalFirst){
            $(scroller).animate({
                scrollTop: pObject.top
            }, topChange ? pObject.duration : 0, function(){
                $(scroller).animate({
                    scrollLeft: pObject.left
                }, leftChange ? pObject.duration : 0, function(){
                    if(typeof pObject.callback === 'function'){
                        pObject.callback();
                    }
                });
            });
        }else{
            $(scroller).animate({
                scrollLeft: pObject.left
            }, leftChange ? pObject.duration : 0, function(){
                $(scroller).animate({
                    scrollTop: pObject.top
                }, topChange ? pObject.duration : 0, function(){
                    if(typeof pObject.callback === 'function'){
                        pObject.callback();
                    }
                });
            });
        }
    }

    handleNavigate(event){
        // Make sure this.hash has a value before overriding default behavior
        if (event.target.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();
            // Move that page into view
            this.moveElementIntoView({element: event.target.hash, animated: true});
        }
    }
}

$(document).ready(()=>{
    let navBar = new NavBar();
});
