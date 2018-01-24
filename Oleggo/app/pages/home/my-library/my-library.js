 const MyLibraryViewModel = require("./my-library-view-model");
 const frameModule = require("ui/frame");

 var Sqlite = require("nativescript-sqlite");

 let page;


 exports.loaded = function (args) {
     page = args.object;
     (new Sqlite("OleggoDB.db")).then((db) => {
         //console.log("gotDB")
         var temp = new MyLibraryViewModel(db)
         page.bindingContext = temp
     }, err => {
         console.info("Failed to open database", err);
         errorAlert("Failed to open database: " + err)
     })
     // page.bindingContext = new MyLibraryViewModel();
 };

 function onDrawerButtonTap(args) {
    //console.log(args)
}

function errorAlert(e) {
    dialogs.alert({
        title: "Error",
        message: e,
        okButtonText: "continue"
    }).then(() => {
        //console.log("Alert closed");
    });
}

exports.onImageBookTap = function (args) {
    //console.log("send " + args.object.id)
    args.object.animate({
        opacity: 0,
        duration: 50
    }).then(function () {
        // Drastically increase the size of the logo
        return args.object.animate({
            opacity: 1,
            duration: 50
        }).then(function(){
            let isbn=args.object.id
            var topmost = frameModule.topmost();
            var naviagationOptions={
                moduleName:"pages/book/book-page",
                context:{
                    bookISBN:isbn
                },
                transition: {
                    name: "fade"
                }
            }
            topmost.navigate(naviagationOptions); 
        })
    })
    
}

