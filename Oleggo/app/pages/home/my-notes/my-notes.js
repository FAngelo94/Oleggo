const MyNotesViewModel = require("./my-notes-view-model");
var Sqlite = require( "nativescript-sqlite" );

var page;
function onLoaded(args) {
	page = args.object;
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
	/* var db_promise = new Sqlite("MyDB", function(err, db) {
		if (err) {
		  console.info("We failed to open database", err);
		} 
		else 
		{
		  // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
			console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
			
		}
	});
	
	console.info("Changes are saved!"); */
	console.info(args.object.id)
	var noteModified=page.getViewById(args.object.id+"T")
	console.info(noteModified.text);
}

exports.modifyNote = modifyNote
exports.onLoaded=onLoaded