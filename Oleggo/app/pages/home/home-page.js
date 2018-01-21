const frameModule = require("ui/frame");
var Sqlite = require("nativescript-sqlite");
const HomeViewModel = require("./home-view-model");

 var page;
 
function onNavigatingTo(args) {
	
    if (args.isBackNavigation) {
        return;
    }

    page = args.object;
	page.bindingContext = new HomeViewModel();
    (new Sqlite("OleggoDB.db")).then(db => {
        db.execSQL("CREATE TABLE IF NOT EXISTS books(id INTEGER PRIMARY KEY AUTOINCREMENT, ISBN TEXT unique, title TEXT, author TEXT, pages TEXT, bookmark TEXT, state TEXT, imagelink TEXT)").then(id => {
            console.log("table  Books created")
            db.execSQL("CREATE TABLE IF NOT EXISTS dictionary(id INTEGER PRIMARY KEY AUTOINCREMENT, isbn TEXT, word TEXT, meaning TEXT)").then(id => {
                console.log("table  Dictionary created")

                db.execSQL("CREATE TABLE IF NOT EXISTS quotes(id INTEGER PRIMARY KEY AUTOINCREMENT, isbn TEXT, quote TEXT, page TEXT, favorite TEXT, date TEXT)").then(id => {
                    console.log("table  Quotes created")
 
                }, error => {
                    console.log("CREATE TABLE ERROR", error);
                });

            }, error => {
                console.log("CREATE TABLE ERROR", error);
            });
        }, error => {
            console.log("CREATE TABLE ERROR", error);
        });
    }, error => {
        console.log("OPEN DB ERROR", error);
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
function onDelete() {
    //console.log("hola")
}

/* ***********************************************************
 * Get the current tab view title and set it as an ActionBar title.
 * Learn more about the onSelectedIndexChanged event here:
 * https://docs.nativescript.org/cookbook/ui/tab-view#using-selectedindexchanged-event-from-xml
 *************************************************************/
function onSelectedIndexChanged(args) {
	if (args.newIndex == 1) {
		page.getViewById("tab-" + args.newIndex).exports.onPageChange()
	}
}
function onLogoTap(args) {
    var topmost = frameModule.topmost();
    var naviagationOptions={
        moduleName:"pages/add-note/add-note-page",
    }
    topmost.navigate(naviagationOptions); 
}
exports.onLogoTap= onLogoTap;
exports.onDelete = onDelete;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.onSelectedIndexChanged = onSelectedIndexChanged;
