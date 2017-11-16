var observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require( "nativescript-sqlite" );

function MyNotesViewModel() {
	openDB();
    var viewModel = observableModule.fromObject({
		NoteList: new ObservableArray(
        [{
                when: "Saved at 10:30 PM",
                note: "We try a note",
                book: "It, Steven King"
            }
        ])
    });
	
    return viewModel;
}

function openDB()
{
	
	var db_promise = new Sqlite("MyTable", function(err, db) {
		if (err) {
		  console.info("We failed to open database", err);
		} else {
		  // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
		  console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
		}
	});
}

function saveChanges(){
	console.info("save changes");
}

module.exports = saveChanges;
module.exports = MyNotesViewModel;
