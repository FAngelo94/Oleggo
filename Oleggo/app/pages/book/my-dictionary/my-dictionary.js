const frameModule = require("ui/frame");
var Sqlite = require( "nativescript-sqlite" );
const MyDictionaryViewModel = require("./my-dictionary-view-model");

var DB = require("~/shared/db/db")

var page;
var ISBN;

function loadList(args){
	page = args.object
	setUpModel()
}

function setUpModel(){
	(new Sqlite("OleggoDB.db")).then((db) => {
         //console.log("gotDB")
         var temp = new MyDictionaryViewModel(db,ISBN)
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
        var id=args.object.id
		db.execSQL(DB.deleteWordById(), [id]).then(id => {
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
function getDataFromParent(args){
    //console.log("dicc"+args)
    ISBN=args;
}
exports.getDataFromParent= getDataFromParent

exports.loadList = loadList
exports.removeWord = removeWord
