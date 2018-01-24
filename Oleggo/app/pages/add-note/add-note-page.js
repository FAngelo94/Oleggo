const frameModule = require("ui/frame");
const AddNoteViewModel = require("./add-note-view-model");
var Sqlite = require("nativescript-sqlite");
var dialogs = require("ui/dialogs");
var Toast = require("nativescript-toast");
var labelNote;
var labelPage;

// require the plugin
var SpeechRecognition = require("nativescript-speech-recognition").SpeechRecognition;
// instantiate the plugin
var speechRecognition = new SpeechRecognition();
// import the options
var SpeechRecognitionTranscription = require("nativescript-speech-recognition").SpeechRecognitionTranscription;
var wd = require("~/shared/word-definition")

var DB = require("~/shared/db/db")

//Toasts
var wordAdded     = Toast.makeText("Word Added Successfully!");
var wordNotValid = Toast.makeText("Enter a word first!");
var quoteAdded    = Toast.makeText("Note Added Successfully!");
var quoteNotValid = Toast.makeText("Enter a note first!");

var selectMainActive = Toast.makeText("Choose a main active book before!");

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
            ////console.log(available ? "YES!" : "NO");
        }
    );
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

function listen(args) {
    args.object.animate({
        opacity: 0,
        duration: 100
    }).then(function () {
        // Drastically increase the size of the logo
        return args.object.animate({
            opacity: 1,
            duration: 100
        });
    })
    //console.info("listening...");
    speechRecognition.startListening({
        returnPartialResults: true,
        // this callback will be invoked repeatedly during recognition
        onResult: function (transcription) {
            //console.info("User said: " + transcription.text);
            //console.info("User finished?: " + transcription.finished);
            if (transcription.finished == true) {
                labelNote.text = transcription.text;
            }
        },
    });
}

function addQuote(args) {
    args.object.animate({
        opacity: 0,
        duration: 100
    }).then(function () {
        // Drastically increase the size of the logo
        return args.object.animate({
            opacity: 1,
            duration: 100
        });
    })

	if(labelNote.text!="")
	{
		(new Sqlite("OleggoDB.db")).then((db) => {
				db.all(DB.readISBNMainActiveBook(), function(err, rows)
				{
					if(rows!="")
					{
						var ISBN = rows[0][1];
						//console.info("ISBN="+ISBN);
						addQuoteDB(ISBN);
					}
					else
					{
						selectMainActive.show()
					}
				})
			},
			err => {
				//console.info("Failed to open database", err);
				errorAlert("Failed to open database: " + err)
			})
	}
	else
	{
		quoteNotValid.show()
	}
}

function addQuoteDB(ISBN) {
    (new Sqlite("OleggoDB.db")).then(db => {
        // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
        //console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
        var d = new Date()
        d = d.toString()
        d = d.substring(0, 21)
        db.execSQL(DB.insertQuote(), [ISBN, labelNote.text, labelPage.text, "0", d]).then(id => {
            quoteAdded.show()
            labelNote.text = ""
			labelPage.text = ""
            //console.info("INSERT RESULT" + id);
        }, error => {
            //console.info("INSERT ERROR" + error);
        });

    }, err => {
        //console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
}

function lookForWord(args) {
    args.object.animate({
        opacity: 0,
        duration: 100
    }).then(function () {
        // Drastically increase the size of the logo
        return args.object.animate({
            opacity: 1,
            duration: 100
        });
    })
	if(labelNote.text!="")
	{
		(new Sqlite("OleggoDB.db")).then((db) => {
			db.all(DB.readISBNMainActiveBook(),function(err, rows)
			{
				if(rows!="")
				{
					var ISBN = rows[0][1];
					//console.info("ISBN="+ISBN);
					wordDefinition(ISBN,labelNote.text);
					labelNote.text=""
				}
				else
				{
					selectMainActive.show()
				}
			})
		},
		err => {
			//console.info("Failed to open database", err);
			errorAlert("Failed to open database: " + err)
		})
	}
	else
	{
		wordNotValid.show()
	}
}

function wordDefinition(ISBN, wordSerch) {
    wd.getDef(wordSerch, "en", null, (definition) => {
        //console.info("definition=" + definition.definition)
        lookForWordDB(ISBN, wordSerch,definition.definition)

    });

}

function lookForWordDB(ISBN, wordSerch,meaning) {
    (new Sqlite("OleggoDB.db")).then(db => {
        // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
        //console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
        //console.info("meaning=" + meaning)
        db.execSQL(DB.insertNewWord(), [ISBN, wordSerch, meaning]).then(id => {
            labelNote.text = ""
            wordAdded.show()
            //console.info("INSERT RESULT" + id)

        }, error => {
            //console.info("INSERT ERROR" + error)
        });

    }, err => {
        //console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
}

function errorAlert(e) {
    dialogs.alert({
        title: "Error",
        message: e,
        okButtonText: "continue"
    }).then(() => {
        ////console.log("Alert closed");
    });
}
function onLogoTap(args) {
    var topmost = frameModule.topmost();
    var naviagationOptions = {
        moduleName: "pages/add-note/add-note-page",
    }
    topmost.navigate(naviagationOptions);
}exports.onLogoTap = onLogoTap;

exports.listen = listen;
exports.addQuote = addQuote;
exports.lookForWord = lookForWord;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.onNavigatingTo = onNavigatingTo;
