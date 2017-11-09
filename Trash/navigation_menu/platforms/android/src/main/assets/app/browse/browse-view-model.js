const observableModule = require("data/observable");

function read_qr() {
    var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
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
		  },
		  function(error) {
			console.info("No scan: " + error);
		  }
	  );
}

function BrowseViewModel() {
    const viewModel = observableModule.fromObject({
		
    });

    return viewModel;
}

module.exports = BrowseViewModel;