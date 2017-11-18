const frameModule = require("ui/frame");
const AddNoteViewModel = require("./add-note-view-model");
var label;

// require the plugin
var SpeechRecognition = require("nativescript-speech-recognition").SpeechRecognition;
// instantiate the plugin
var speechRecognition = new SpeechRecognition();
// import the options
var SpeechRecognitionTranscription = require("nativescript-speech-recognition").SpeechRecognitionTranscription;

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
	label=page.getViewById("speakText");
    page.bindingContext = new AddNoteViewModel();
	speechRecognition.available().then(
	  function(available) {
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

function listen(args){
	console.info("listening...");
	speechRecognition.startListening(
	{
		returnPartialResults: true,
		// this callback will be invoked repeatedly during recognition
        onResult: function (transcription) {
            console.info("User said: " + transcription.text);
            console.info("User finished?: " + transcription.finished);
			if(transcription.finished==true)
			{
				label.text=transcription.text;
			}
        },
	});
}
exports.listen = listen;

function addQuote(args){
	console.info(label.text);
}
exports.addQuote = addQuote;

function lookForWord(args){
	console.info(label.text);
}
exports.lookForWord = lookForWord;