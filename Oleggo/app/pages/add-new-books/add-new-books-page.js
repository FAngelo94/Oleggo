const frameModule = require("ui/frame");
var viewModule=require("ui/core/view");
const AddNewBooksViewModel = require("./add-new-books-view-model");
var dialogs = require("ui/dialogs");
//const isbn = require('node-isbn')
var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;

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
    page.bindingContext = new AddNewBooksViewModel();
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

//Function for QR
function read_qr() {
    
	var barcodescanner = new BarcodeScanner();

	  barcodescanner.scan({
		formats: "QR_CODE,PDF_417",   // Pass in of you want to restrict scanning to certain types
		cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
		cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
		message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
		showFlipCameraButton: true,   // default false
		preferFrontCamera: false,     // default false
		showTorchButton: true,        // default false
		beepOnScan: true,             // Play or Suppress beep on scan (default true)
		torchOn: false,               // launch with the flashlight on (default false)
		closeCallback: function () { console.log("Scanner closed"); }, // invoked when the scanner was closed (success or abort)
		resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
		orientation: "portrait",     // Android only, optionally lock the orientation to either "portrait" or "landscape"
		openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
	  }).then(
		  function(result) {
			console.info("Scan format: " + result.format);
			console.info("Scan text:   " + result.text);
			tryAddBook(resut.text);
		  },
		  function(error) {
			console.info("No scan: " + error);
		  }
	  ); 
}
function openQR(eventData) {
	read_qr()
}

function readISBN(args){
	var page=args.object.page;
	var isbn=viewModule.getViewById(page,"isbn");
	console.info(isbn.text);
/* 	isbn.resolve(isbn.text, function (err, book) {
		if (err) {
			tryAddBook('Book not found' + err)
		} else {
			tryAddBook('Book found: ' + book.title)
		}
	})
	 */
}

function tryAddBook(isbn){

	dialogs.alert("Book added").then( function () {
	});

}

exports.readISBN=readISBN;
exports.openQR = openQR;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
