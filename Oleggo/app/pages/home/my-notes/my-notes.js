var MyNotesViewModel = require("./my-notes-view-model");
var Sqlite = require( "nativescript-sqlite" );

var page;
function onLoaded(args) {
	page = args.object;
    page.bindingContext = MyNotesViewModel();
	console.info(page);
}

function modifyNote(args) {
	var db_promise = new Sqlite("MyDB", function(err, db) {
		if (err) {
		  console.info("We failed to open database", err);
		} 
		else 
		{
		  // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
			console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
			
		}
	});
	
	console.info("Changes are saved!");
	console.info(args.object.id);
	var noteModified=page.getViewById(args.object.id+"T");
	console.info(noteModified.text);
}

function addNote(args){
	var db_promise = new Sqlite("MyDB", function(err, db) {
		if (err) {
		  console.info("We failed to open database", err);
		} 
		else 
		{
		  // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
			console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
			
		}
	});
	var newNote=page.getViewById("newNote");
	console.info(newNote.text);
	
	const currentDate = new Date();
	console.info(currentDate);
	console.info(currentDate.toString().substring(0,21));
}

exports.addNote = addNote;
exports.modifyNote = modifyNote;
exports.onLoaded=onLoaded