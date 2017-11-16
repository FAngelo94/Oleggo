const frameModule = require("ui/frame");
var Sqlite = require( "nativescript-sqlite" );
const HomeViewModel = require("./home-view-model");


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

    const page = args.object;
    page.bindingContext = new HomeViewModel();
	
	//Open DB
	if(!Sqlite.exists("MyDB"))
	{
		var db_promise = new Sqlite("MyDB", function(err, db) {
			if (err) {
			  console.info("We failed to open database", err);
			} 
			else 
			{
			  // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
				console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
				db.version(function(err, ver) {
					if (ver === 0) {
					  db.execSQL("Create table Notes(when text, note text, book text)");
					  db.version(1); // Sets the version to 1
					}
				});
			}
		});
	}
	else
		console.info("Exist yet");
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

/* ***********************************************************
 * Get the current tab view title and set it as an ActionBar title.
 * Learn more about the onSelectedIndexChanged event here:
 * https://docs.nativescript.org/cookbook/ui/tab-view#using-selectedindexchanged-event-from-xml
 *************************************************************/
function onSelectedIndexChanged(args) {
    const tabView = args.object;
    const bindingContext = tabView.bindingContext;
    const selectedTabViewItem = tabView.items[args.newIndex];

    bindingContext.set("title", selectedTabViewItem.title);
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.onSelectedIndexChanged = onSelectedIndexChanged;

