const frameModule = require("ui/frame");
var Sqlite = require("nativescript-sqlite");
const BookViewModel = require("./book-view-model");

exports.other = function () {
    //frameModule.topmost().navigate("views/library/library");
};
let page;


 exports.loaded = function (args) {
     page = args.object;
     (new Sqlite("OleggoDB.db")).then((db) => {
         var temp = new BookViewModel(db,page.navigationContext.bookISBN)
         console.log(JSON.stringify(temp.Book))
         console.log(JSON.stringify(temp.Dictionary))
         console.log(JSON.stringify(temp.Quotes))
         page.bindingContext = temp
     }, err => {
         console.info("Failed to open database", err);
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
    //TODO corregir para cuando llegue

   // page.bindingContext = new BookViewModel();
}

function errorAlert(e) {
    dialogs.alert({
        title: "Error",
        message: e,
        okButtonText: "continue"
    }).then(() => {
        console.log("Alert closed");
    });
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

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
