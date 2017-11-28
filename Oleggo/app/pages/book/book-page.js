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
        var temp = new BookViewModel(db, page.navigationContext.bookISBN)
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

function onSelectedIndexChanged(args) {
    const tabView = args.object;
    /*   const bindingContext = tabView.bindingContext;
      const selectedTabViewItem = tabView.items[args.newIndex];

      bindingContext.set("title", selectedTabViewItem.title); */
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

function onProgressButtonTap(args) {
    console.log("hello bitch")
    let isbn = "1234"
    /*  var topmost = frameModule.topmost();
     var naviagationOptions={
         moduleName:"pages/book/book-progress/book-progress-page",
         context:{
             bookISBN:isbn
         },
         transition: {
             name: "fade"
         }
     }
     topmost.navigate(naviagationOptions);  */

    var fullscreen = true
    var context=page.bindingContext._map.Book

    page.showModal("pages/book-progress/book-progress-page", context, function (page, set) {
        console.log(page + "/" + set);
       // label.text = username + "/" + password;
    }, fullscreen);
}
exports.onProgressButtonTap = onProgressButtonTap;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;

exports.onSelectedIndexChanged = onSelectedIndexChanged;
