class NavBar{
    constructor(){
        this.navButtons = $('.nav-bar-item');
        this.navButtonContainers = $('.nav-item-container');
        this.pageContent = $('#content');
        this.contentRows = $('.content-row');

        //make a grid of screens
        //  note: each content-row must have the same number of screens.
        //  if there are not enough screens, enter an 'empty-screen' to fill the space
        this.screenGrid = [];
        for(let i = 0; i < this.contentRows.length; i++){
            this.screenGrid[i] = $(this.contentRows[i]).find('.screen');
        }

        this.currentScreenPos = {row: 0, col: 0};
        this.currentPage = null;
        this.setUpListeners();
    }

    load(pObject = {callback: ()=>{}}){
        this.setScreenSize();
        this.setCurrentPage({animated: false, callback: pObject.callback});
    }

    setUpListeners(){
        $(this.navButtons).click((event)=>{
            this.handleNavigate(event);
        });

        window.onpopstate = ()=>{
            this.setCurrentPage({animated: true});
        };
    }

    setScreenSize(){
        let screens = $('.content-row').first().find('.screen');
        let content = $('#content');
        if(screens.length > 0){
          $(content).css({'width':(100*screens.length) + 'vw'});
        }
    }

    setCurrentScreenPos(){
        if(!this.currentPage){
            console.log("current page not defined");
            return;
        }

        for(let row = 0; row < this.screenGrid.length; row++){
            for(let col = 0; col < this.screenGrid[row].length; col++){
                if($(this.currentPage).attr('id') === $(this.screenGrid[row][col]).attr('id')){
                    this.currentScreenPos = {row: row, col: col};
                    return;
                }
            }
        }
    }

    setMenuItemsForCurrentPos(){
        const info = this.getNavBarMenuInfoForGridPos(this.currentScreenPos);
        this.setMenuItem({selector: '#nav-item-left', href: info.left.href, name: info.left.name});
        this.setMenuItem({selector: '#nav-item-right', href: info.right.href, name: info.right.name});
        this.setMenuItem({selector: '#nav-item-top', href: info.top.href, name: info.top.name});
        this.setMenuItem({selector: '#nav-item-bottom', href: info.bottom.href, name: info.bottom.name});
    }

    setMenuItem(pObject = {selector:"", href:"", name:""}){
        const item = $(pObject.selector);
        $(item).text(pObject.name);
        $(item).attr('href', pObject.href);
    }

    setCurrentPage(pObject = {animated: true, callback:()=>{}}){
        let page = window.location.hash;
        if(page === ''){
            page = '#home'
        }
        this.moveElementIntoView({element: $(page), animated:pObject.animated, callback: pObject.callback});
        this.currentPage = $(page).first();
    }

    moveElementIntoView(pObject = {element: null, animated: true, callback:()=>{}}){
        if (pObject.element === null)
            return;

        let animationTime = pObject.animated ? 800 : 0;
        let top = $(pObject.element).position().top;
        let left = $(pObject.element).position().left;

        const completion = () => {
            // Add hash (#) to URL when done scrolling (default click behavior)
            // window.location.hash = $(pObject.element).attr('id') ? '#'+$(pObject.element).attr('id') : '';
            this.currentPage = $(pObject.element);
            this.setCurrentScreenPos();
            this.setMenuItemsForCurrentPos();
            // Call the callback function
            if(typeof pObject.callback === 'function'){
                pObject.callback();
            }
        }

        this.scrollToPos({duration: animationTime, left: left, top: top, callback: completion});
    }

    scrollToPos(pObject = {duration: 0, left:0, top:0, callback: ()=>{}}){
        const windowTop = $(window).scrollTop();
        const windowLeft = $(window).scrollLeft();
        const topChange = windowTop !== pObject.top;
        const leftChange = windowLeft !== pObject.left;

        $('#viewport-content').addClass('content-scaled');
        $(this.navButtonContainers).addClass('hidden');
        setTimeout(()=>{
            $('#viewport-content').removeClass('content-scaled');
        },500);
        setTimeout(()=>{
            $(this.navButtonContainers).removeClass('hidden');
        },600);

        $('#content').css({'margin-top': -pObject.top + 'px','margin-left':-pObject.left+'px'});
        setTimeout(pObject.callback, 1000);
    }

    checkScreenGridOutOfBounds(coord = {row: 0, col: 0}){
        //make sure our indices are not out of bounds
        if(coord == null || coord.row < 0 || coord.row >= this.screenGrid.length || this.screenGrid.length == 0
        || coord.col < 0 || coord.col >= this.screenGrid[0].length || this.screenGrid[0].length == 0){
            return true;
        }else{
            return false;
        }
    }

    getNavBarMenuInfoForGridPos(gridPos = {row:0, col:0}){
        if(this.checkScreenGridOutOfBounds(gridPos))
            return null;

        let leftCoord = gridPos.col - 1 >= 0 ? {row: gridPos.row, col: gridPos.col - 1} : null;
        let topCoord = gridPos.row - 1 >= 0 ? {row: gridPos.row - 1, col: gridPos.col} : null;
        let rightCoord = gridPos.col + 1 <= this.screenGrid[0].length - 1 ? {row: gridPos.row, col: gridPos.col + 1} : null;
        let bottomCoord = gridPos.row + 1 <= this.screenGrid.length - 1 ? {row: gridPos.row + 1, col: gridPos.col} : null;

        let coords = {
            top: this.coordPointingToValidScreen(topCoord) ? this.getInfoForScreenAtCoord(topCoord) : this.getInfoForValidScreenForRow(topCoord),
            bottom: this.coordPointingToValidScreen(bottomCoord) ? this.getInfoForScreenAtCoord(bottomCoord) : this.getInfoForValidScreenForRow(bottomCoord),
            right: this.coordPointingToValidScreen(rightCoord) ? this.getInfoForScreenAtCoord(rightCoord) : this.getInfoForValidScreenForCol(rightCoord),
            left: this.coordPointingToValidScreen(leftCoord) ? this.getInfoForScreenAtCoord(leftCoord) : this.getInfoForValidScreenForCol(leftCoord)
        };

        return coords;
    }

    coordPointingToValidScreen(coord = {row: 0, col: 0}){
        if(this.checkScreenGridOutOfBounds(coord) || coord == null)
            return false;

        let element = this.screenGrid[coord.row][coord.col];
        //if it's not an empty screen and it is a screen, we're good
        if(!$(element).hasClass('empty-screen') && $(element).hasClass('screen')){
            return true;
        }else{
            return false;
        }
    }

    getInfoForValidScreenForRow(coord = {row: 0, col: 0}){
        const newCoord = this.getCoordForValidScreenForRow(coord);
        return this.getInfoForScreenAtCoord(newCoord);
    }

    getCoordForValidScreenForRow(coord = {row: 0, col: 0}){
        //make sure we're not going out of bounds
        if(this.checkScreenGridOutOfBounds(coord))
            return null;

        for(let col = 0; col < this.screenGrid[coord.row].length; col++){
            let screen = $(this.screenGrid[coord.row][col]);
            //if it is a valid screen
            if(!$(screen).hasClass('empty-screen')){
                return {row: coord.row, col: col};
            }
        }
        //we didn't find anything
        return null;
    }

    getInfoForValidScreenForCol(coord = {row: 0, col: 0}){
        const newCoord = this.getCoordForValidScreenForCol(coord);
        return this.getInfoForScreenAtCoord(newCoord);
    }

    getCoordForValidScreenForCol(coord = {row: 0, col: 0}){
        //make sure we're not going out of bounds
        if(this.checkScreenGridOutOfBounds(coord))
            return null;

        for(let row = 0; row < this.screenGrid.length; row++){
            let screen = $(this.screenGrid[row][coord.col]);
            //if it is a valid screen
            if(!$(screen).hasClass('empty-screen')){
                return {row: row, col: coord.col};
            }
        }
        //we didn't find anything
        return null;
    }

    getInfoForScreenAtCoord(coord = {row: 0, col: 0}){
        let returnObject = {name:'', href: ''}
        if(coord != null){
            returnObject.name = $(this.screenGrid[coord.row][coord.col]).attr('title');
            returnObject.href = '#'+$(this.screenGrid[coord.row][coord.col]).attr('id');
        }
        return returnObject;
    }

    handleNavigate(event){
        // Make sure this.hash has a value before overriding default behavior
        if (event.target.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();
            history.pushState(null, null, event.target.hash);
            this.setCurrentPage();
            // Move that page into view
            // this.moveElementIntoView({element: event.target.hash, animated: true});
        }
    }
}
