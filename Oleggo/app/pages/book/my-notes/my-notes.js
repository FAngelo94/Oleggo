const MyNotesViewModel = require("./my-notes-view-model");
var Sqlite = require("nativescript-sqlite");
var Toast = require("nativescript-toast");

var saveChanges = Toast.makeText("Modification Saved Successfully!");

const book = require("./../book-page");

var ISBN;
var page;

function onLoaded(args) {
    page = args.object
    setUpModel()
}

function setUpModel() {
    (new Sqlite("OleggoDB.db")).then((db) => {
        console.log("gotDB1")
        var temp = new MyNotesViewModel(db, ISBN)
        console.info("notes temp=" + JSON.stringify(temp.NoteList))
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
        var id = args.object.id
        var quote = page.getViewById(id + "text")
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
        var id = args.object.id
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

function FavoriteNote(args) {
    (new Sqlite("OleggoDB.db")).then(db => {
        // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
        console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
        console.log(args.object.id)
        var obj = args.object.id.replace('fav', '')
        var fav;
        for (i = 0; i < page.bindingContext.NoteList.length; i++) {
            if (page.bindingContext.NoteList[i].key == obj) {
                var star = page.getViewById(args.object.id);
                if (page.bindingContext.NoteList[i].favorite == '1') {
                    page.bindingContext.NoteList[i].favorite = '0'
                    fav = "0"
                    star.text = "\uf006";
                }
                else {
                    page.bindingContext.NoteList[i].favorite = '1'
                    fav = "1"
                    star.text = "\uf005";
                }
                console.log(JSON.stringify(page.bindingContext.NoteList[i]))
                break;
            }
        }

        db.execSQL("UPDATE quotes SET Favorite = ? WHERE id = ?", [fav, obj]).then(id => {
            console.info("INSERT RESULT" + id);
        }, error => {
            console.info("INSERT ERROR" + error);
        });

    }, err => {
        console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
}

function getDataFromParent(args) {
    console.log("notes" + args)
    ISBN = args;
}

function onPageChange(){
    for (i = 0; i < page.bindingContext.NoteList.length; i++) {
        console.log("entre")
        if (page.bindingContext.NoteList[i].favorite == '1') {
            var name=("fav" + page.bindingContext.NoteList[i].key).toString()
            var star = page.getViewById(name);
            star.text = "\uf005";
        }
    }
}
exports.onPageChange= onPageChange
exports.getDataFromParent = getDataFromParent
exports.FavoriteNote = FavoriteNote
exports.removeNote = removeNote
exports.modifyNote = modifyNote
exports.onLoaded = onLoaded
