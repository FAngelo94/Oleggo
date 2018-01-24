"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frameModule = require("ui/frame");

let page;

function loaded(args) {
    console.log("hola splash")
    page = args.object;
    var message = page.getViewById("logo");
    message.animate({
        scale: { x: 3, y: 3 },
        duration: 10
    })
     .then(function () {
        message.animate({
            opacity: 1,
            duration: 800
        }).then(function(){
            message.animate({
                scale: { x: 1, y: 1 },
                translate: { x: -120, y: 0 },
                curve:"easeInOut",
                duration: 1500
            })
            page.getViewById("logo1").animate({
                opacity: 1,
                translate: { x: 20, y: 0 },
                delay:500,
                curve:"easeOut",
                duration: 1000
            })
            var topmost = frameModule.topmost();
                var naviagationOptions={
                    moduleName:"pages/home/home-page",
                    transition: {
                        name: "fade",
                        duration: 1000
                    }
                }
                setTimeout(function(){
                    topmost.navigate(naviagationOptions); 
                },1470)
                
        })
    })
}

function onNavigatingTo(args) {
    /* ***********************************************************
     * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
     * Skipping the re-initialization on back navigation means the user will see the
     * page in the same data state that he left it in before navigating.
     *************************************************************/
    if (args.isBackNavigation) {
        return;
    }
    loaded(args)
    //TODO corregir para cuando llegue

    // page.bindingContext = new BookViewModel();
}
exports.onNavigatingTo = onNavigatingTo;
