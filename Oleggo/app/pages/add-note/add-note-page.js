const frameModule = require("ui/frame");
const AddNoteViewModel = require("./add-note-view-model");
var Sqlite = require("nativescript-sqlite");
var dialogs = require("ui/dialogs");
var Toast = require("nativescript-toast");
var labelNote;
var labelPage;
var wordAdded = Toast.makeText("Word Added Successfully!");
var quoteAdded = Toast.makeText("Quote Added Successfully");

// require the plugin
var SpeechRecognition = require("nativescript-speech-recognition").SpeechRecognition;
// instantiate the plugin
var speechRecognition = new SpeechRecognition();
// import the options
var SpeechRecognitionTranscription = require("nativescript-speech-recognition").SpeechRecognitionTranscription;
var wd = require("word-definition")
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
    labelNote = page.getViewById("speakText");
	labelPage = page.getViewById("page");
    page.bindingContext = new AddNoteViewModel();
    speechRecognition.available().then(
        function (available) {
            console.log(available ? "YES!" : "NO");
        }
    );
}
exports.onNavigatingTo = onNavigatingTo;
/* ***********************************************************
 * According to guidelines, if you have a drawer on your page, you should always
 * have a button that opens it. Get a reference to the RadSideDrawer view and
 * use the showDrawer() function to open the app drawer section.
 *************************************************************/
function onDrawerButtonTap(args) {
    const sideDrawer = frameModule.topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}
exports.onDrawerButtonTap = onDrawerButtonTap;

function listen(args) {
    console.info("listening...");
    speechRecognition.startListening({
        returnPartialResults: true,
        // this callback will be invoked repeatedly during recognition
        onResult: function (transcription) {
            console.info("User said: " + transcription.text);
            console.info("User finished?: " + transcription.finished);
            if (transcription.finished == true) {
                labelNote.text = transcription.text;
            }
        },
    });
}
exports.listen = listen;

function addQuote(args) {
    (new Sqlite("OleggoDB.db")).then((db) => {db.all("SELECT * FROM books WHERE State=1", function (error, rows) {
        if (error) {
            console.log("SELECT ERROR", error);
            return ("SELECT ERROR" + error)
        }
        else {
				var res = (rows[0].toString()).split(",");
				var ISBN = res[1];
				console.info(ISBN);
				addQuoteDB(ISBN);
		}
    })},
	err => {
         console.info("Failed to open database", err);
         errorAlert("Failed to open database: " + err)
     })
}

function addQuoteDB(ISBN)
{
	(new Sqlite("OleggoDB.db")).then(db => {
        // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
        console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
			var d=new Date()
			d=d.toString()
			d=d.substring(0,21)
			db.execSQL("INSERT INTO quotes (ISBN, Quote, Page, Favorite, Date) VALUES (?, ?, ?, ?, ?)", [ISBN, labelNote.text, labelPage.text, "0", d]).then(id => {
			quoteAdded.show()
			labelNote.text=""
			console.info("INSERT RESULT" + id);
        }, error => {
            console.info("INSERT ERROR" + error);
        });

    }, err => {
        console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
}

function lookForWord(args) {
    (new Sqlite("OleggoDB.db")).then((db) => {db.all("SELECT * FROM books WHERE State=1", function (error, rows) {
        if (error) {
            console.log("SELECT ERROR", error);
            return ("SELECT ERROR" + error)
        }
        else {
				var res = (rows[0].toString()).split(",");
				var ISBN = res[1];
				wordDefinition(ISBN);
		}
    })},
	err => {
         console.info("Failed to open database", err);
         errorAlert("Failed to open database: " + err)
     })
}

function wordDefinition(ISBN)
{
	console.info("Inizio")
	var meaning = "Tetto"
	wd.getDef(labelNote.text, "en", null, (definition) => {
		console.info("definition="+definition.definition)
		lookForWordDB(ISBN, definition.definition)
		
	});
	
}

function lookForWordDB(ISBN, meaning)
{
	(new Sqlite("OleggoDB.db")).then(db => {
			// This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
			console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
			console.info("meaning="+meaning)
			db.execSQL("INSERT INTO dictionary (ISBN, word, meaning) VALUES (?, ?, ?)", [ISBN, labelNote.text, meaning]).then(id => {
				labelNote.text=""
				wordAdded.show()
				console.info("INSERT RESULT" + id)
				
			}, error => {
				console.info("INSERT ERROR" + error)
			});

		}, err => {
			console.info("Failed to open database", err);
			errorAlert("Failed to open database: " + err)
		})
}
exports.addQuote = addQuote;
exports.lookForWord = lookForWord;

function errorAlert(e) {
    dialogs.alert({
        title: "Error",
        message: e,
        okButtonText: "continue"
    }).then(() => {
        console.log("Alert closed");
    });
}
