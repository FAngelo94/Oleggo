var observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require( "nativescript-sqlite" );

function MyNotesViewModel() {
	readDB();
	//Read from DB and insert in an ObservableArray
	var w="Saved at 10:30 PM";
	var n="We try a note";
	var b="It, Steven King";
	var dataPage=new ObservableArray(); 
	dataPage.push([	{
						when: w,
						note: n,
						book: b
					}		
				]);
	//Pass the ObservableArray to the page
    var viewModel = observableModule.fromObject({
		NoteList: dataPage
    });
	
    return viewModel;
}
module.exports = MyNotesViewModel;

function readDB()
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