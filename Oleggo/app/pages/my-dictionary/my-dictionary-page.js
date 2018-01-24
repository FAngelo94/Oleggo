const frameModule = require("ui/frame");
var Sqlite = require( "nativescript-sqlite" );
const MyDictionaryViewModel = require("./my-dictionary-view-model");

var DB = require("~/shared/db/db")

var page;
var searchLabel;
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

function loadList(args){
	page = args.object
	searchLabel = page.getViewById("word");
	setUpModel()
}

function setUpModel(){
	(new Sqlite("OleggoDB.db")).then((db) => {
         ////console.log("gotDB")
         var temp = new MyDictionaryViewModel(db,"")
		 //console.info("temp="+temp)
         page.bindingContext = temp
     }, err => {
         //console.info("Failed to open database", err)
         errorAlert("Failed to open database: " + err)
     })
}

function removeWord(args){	
	(new Sqlite("OleggoDB.db")).then(db => {
        // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
        //console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
        var word=args.object.id
		db.execSQL(DB.deleteWord(), [word]).then(id => {
            //console.info("INSERT RESULT" + id);
        }, error => {
            //console.info("INSERT ERROR" + error);
        });

    }, err => {
        //console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
	setUpModel()
}

function searchWord(args){
	(new Sqlite("OleggoDB.db")).then((db) => {
         var temp = new MyDictionaryViewModel(db,searchLabel.text)
		 //console.info("temp="+temp)
         page.bindingContext = temp
     }, err => {
         //console.info("Failed to open database", err)
         errorAlert("Failed to open database: " + err)
     })
}
function onLogoTap(args) {
    var topmost = frameModule.topmost();
    var naviagationOptions = {
        moduleName: "pages/add-note/add-note-page",
        transition: {
            name: "fade"
        }
    }
    topmost.navigate(naviagationOptions);
}exports.onLogoTap = onLogoTap;

exports.searchWord = searchWord
exports.loadList = loadList
exports.removeWord = removeWord
exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
