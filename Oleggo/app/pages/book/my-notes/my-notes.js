const MyNotesViewModel = require("./my-notes-view-model");
var Sqlite = require( "nativescript-sqlite" );
var Toast = require("nativescript-toast");

var saveChanges = Toast.makeText("Modification Saved Successfully!");

const book = require("./../book-page");

var page;
function onLoaded(args) {
    page = args.object
	
	console.info("-----------------------------ATTENTION----------------------")
	console.info(MyNotesViewModel)
	console.info("-----------------------------ATTENTION----------------------")
	console.info(book.readISBN())
	console.info("-----------------------------ATTENTION----------------------")
	
	setUpModel()
}

function setUpModel(){
	(new Sqlite("OleggoDB.db")).then((db) => {
         console.log("gotDB")
         var temp = new MyNotesViewModel(db)
		 console.info("temp="+temp)
         page.bindingContext = temp
     }, err => {
         console.info("Failed to open database", err)
         errorAlert("Failed to open database: " + err)
     })
}

function modifyNote(args) {

	(new Sqlite("OleggoDB.db")).then(db => {
        // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
        console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
        var id=args.object.id
		var quote=page.getViewById(id+"text")
		db.execSQL("UPDATE quotes SET Quote = ? WHERE id = ?", [quote.text, id]).then(id => {
            saveChanges.show()
			console.info("INSERT RESULT" + id);
        }, error => {
            console.info("INSERT ERROR" + error);
        });

    }, err => {
        console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
}

function removeNote(args) {

	(new Sqlite("OleggoDB.db")).then(db => {
        // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
        console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
        var id=args.object.id
		db.execSQL("DELETE FROM quotes WHERE id = ?", [id]).then(id => {
            console.info("INSERT RESULT" + id);
        }, error => {
            console.info("INSERT ERROR" + error);
        });

    }, err => {
        console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
	setUpModel()
}

function notFavoriteNote(args) {

	(new Sqlite("OleggoDB.db")).then(db => {
        // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
        console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
        var id=args.object.id
		db.execSQL("UPDATE quotes SET Favorite = ? WHERE id = ?", ["0", id]).then(id => {
            console.info("INSERT RESULT" + id);
        }, error => {
            console.info("INSERT ERROR" + error);
        });

    }, err => {
        console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
}
function getDataFromParent(args){
    console.log(args)
}
exports.getDataFromParent= getDataFromParent
exports.notFavoriteNote = notFavoriteNote
exports.removeNote = removeNote
exports.modifyNote = modifyNote
exports.onLoaded=onLoaded