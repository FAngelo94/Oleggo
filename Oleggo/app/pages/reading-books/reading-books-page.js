const frameModule = require("ui/frame");
const ReadingBooksViewModel = require("./reading-books-view-model");
var Sqlite = require("nativescript-sqlite");

let page;

exports.loaded = function (args) {
    page = args.object;
    (new Sqlite("OleggoDB.db")).then((db) => {
        //console.log("gotDB")
        var temp = new ReadingBooksViewModel(db)
        page.bindingContext = temp
        //console.log(JSON.stringify(temp))
    }, err => {
        //console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
};
/* ***********************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
function onNavigatingTo(args) {
    /* ***********************************************************
     * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
     * Skipping the re-initialization on back navigation means the user will see the
     * page in the same data state that he left it in before navigating.
     *************************************************************/
    if (args.isBackNavigation) {
        return;
    }
}

/* ***********************************************************
 * According to guidelines, if you have a drawer on your page, you should always
 * have a button that opens it. Get a reference to the RadSideDrawer view and
 * use the showDrawer() function to open the app drawer section.
 *************************************************************/
function onDrawerButtonTap(args) {
    const sideDrawer = frameModule.topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

exports.onImageBookTap = function (args) {
    //console.log("send " + args.object.id)
    args.object.animate({
        opacity: 0,
        duration: 100
    }).then(function () {
        // Drastically increase the size of the logo
        return args.object.animate({
            opacity: 1,
            duration: 100
        }).then(function () {
            let isbn = args.object.id
            var topmost = frameModule.topmost();
            var naviagationOptions = {
                moduleName: "pages/book/book-page",
                context: {
                    bookISBN: isbn
                }
            }
            topmost.navigate(naviagationOptions);
        })
    })
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
