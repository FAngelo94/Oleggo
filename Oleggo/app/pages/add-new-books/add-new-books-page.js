const frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
const AddNewBooksViewModel = require("./add-new-books-view-model");
var dialogs = require("ui/dialogs");
var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
var http = require("http");
var Sqlite = require("nativescript-sqlite");
var DB = require("~/shared/db/db")

var Toast = require("nativescript-toast");

var ISBNPresentYet     = Toast.makeText("Error! An equal ISBN is already present in DB!");

const defaultOptions = {
    timeout: 2500,
    method: "GET"
};

const OPENLIBRARY_API_BASE = 'https://openlibrary.org';
const OPENLIBRARY_API_BOOK = '/api/books';

const WORLDCAT_API_BASE = 'http://xisbn.worldcat.org';
const WORLDCAT_API_BOOK = '/webservices/xid/isbn';
var bookfail= Toast.makeText("Enter ISBN first!");
var page;
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

    page = args.object;
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

    const barcodescanner = new BarcodeScanner();

    barcodescanner.scan({
        formats: "AZTEC,CODE_39,CODE_93,CODE_128,DATA_MATRIX,EAN_8,EAN_13,ITF,PDF_417,QR_CODE,UPC_E,CODABAR,MAXICODE,RSS_14,UPC_A", // Pass in of you want to restrict scanning to certain types
        cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
        cancelLabelBackgroundColor: "#F98735", // iOS only, default '#000000' (black)
        message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
        showFlipCameraButton: true, // default false
        preferFrontCamera: false, // default false
        showTorchButton: true, // default false
        beepOnScan: true, // Play or Suppress beep on scan (default true)
        torchOn: false, // launch with the flashlight on (default false)
        closeCallback: function () { console.log("Scanner closed"); }, // invoked when the scanner was closed (success or abort)
        resultDisplayDuration: 500, // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
        orientation: "portrait", // Android only, optionally lock the orientation to either "portrait" or "landscape"
        openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
    }).then(
        (result) => {
            console.info("Scan format: " + result.format)
            console.info("Scan text:   " + result.text)
			var isbn = viewModule.getViewById(page, "isbn")
            isbn.text=result.text
        },
        (error) => {
            console.info("No scan: " + error);
        }
    );
}

function openQR(eventData) {
    read_qr();
}

function readISBN(args) {
    let isbn = viewModule.getViewById(page, "isbn");
    console.info(isbn.text);
    if (isbn.text != "") {
        resolve(isbn.text, (err, book) => {
            if (err) {
                console.info('Book not found ' + err)
                //errorAlert('Book not found. ' + err)
				let content = {
					title: "Book not found. ",
					message: "Insert the title manually",
					defaultText: "Title",
					inputType: dialogs.inputType.text,
					okButtonText: "continue",
					cancelButtonText: "cancel"
				};
				dialogs.prompt(content).then((r) => {
					console.log("Dialog result: " + r.result + ", text: " + r.text);
						if (r.result === true) {
							if (r.text !='') {
								var book = {
									"ISBN": isbn,
									'title': r.text,
									'authors': "",
									'imageLink': "~/images/empty.png",
								};
								
								tryAddAuthor(book.title + "\nAuthor: ", book);
							}
							else {
								errorAlert("Author is not valid");
							}
						}
					});
				
            }
            else {
                console.info('Book found: ' + JSON.stringify(book))
                if (book.authors == "Unknown") {
                    tryAddAuthor(book.title + "\nAuthor: ", book);
                }
                else
                    tryAddBook(book.title + "\nAuthor: " + book.authors + "\nPage count:", book);
            }
        });
    }
    else {
       bookfail.show()
    }
}

function tryAddAuthor(data, book) {

	console.info("TRY ADD AUTHOR")

    let content = {
        title: "Book response",
        message: data,
        defaultText: "Author",
        inputType: dialogs.inputType.text,
        okButtonText: "continue",
        cancelButtonText: "cancel"
    };

    dialogs.prompt(content).then((r) => {
        console.log("Dialog result: " + r.result + ", text: " + r.text);
        if (r.result === true) {
            if (r.text !='') {
                book.authors = r.text;
                tryAddBook(book.title + "\nAuthor: " + book.authors + "\nPage count:", book);
            }
            else {
                errorAlert("Author is not valid");
            }
        }
    });
}

function tryAddBook(data, book) {

    let content = {
        title: "Book response",
        message: data,
        defaultText: "Page count",
        inputType: dialogs.inputType.number,
        okButtonText: "continue",
        cancelButtonText: "cancel"
    };

    console.log(book.pageCount);

    if (book.pageCount > 0) {
        console.info("book ok");
        content.defaultText = book.pageCount.toString();
    }
    else {
        console.info("book not pages");
    }

    dialogs.prompt(content).then((r) => {
        console.log("Dialog result: " + r.result + ", text: " + r.text);
        if (r.result === true) {
            if (isNumeric(r.text)) {
                book.pageCount = r.text;
                if (book.imageLink.includes("S.jpg")) {
                    console.log("si")
                    book.imageLink = book.imageLink.replace("S.jpg", 'M.jpg');

                }

                addBookDB(book);
            }
            else {
                errorAlert("Page number is not valid");
            }
        }
    });
}

function addBookDB(data) {
    (new Sqlite("OleggoDB.db")).then(db => {
        // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
        console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
        db.execSQL(DB.insertNewBook(), [data.ISBN, data.title, data.authors, data.pageCount, "0", "0", data.imageLink]).then(id => {
            console.info("INSERT RESULT", id);
			var topmost = frameModule.topmost();
			var naviagationOptions={
				moduleName:"pages/home/home-page",
			}
			topmost.navigate(naviagationOptions); 
            
			db.all(DB.readAllBooks()).then(rows => {
                for (var row in rows) {
                    console.info("RESULT", rows[row]);
                }

            }, error => {
                console.info("SELECT ERROR", error);
            });
			
        }, error => {
            ISBNPresentYet.show()
        });

    }, err => {
        console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
}

function errorAlert(err) {
    dialogs.alert({
        title: "Error",
        message: err,
        okButtonText: "continue"
    }).then(() => {
        console.log("Alert closed");
    });
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
/* 
good books
    9780307474278
    9780545139700
    9780241968581
    9780544003415
*/
function _resolveOpenLibrary(isbn, callback) {
    var standardize = function standardize(book) {
        var standardBook = {
            "ISBN": isbn,
            'title': book.details.title,
            'publishedDate': book.details.publish_date,
            'authors': [],
            'description': book.details.subtitle,
            'industryIdentifiers': [],
            'pageCount': book.details.number_of_pages,
            'printType': 'BOOK',
            'categories': [],
            'imageLink': "~/images/empty.png",
            'previewLink': book.preview_url,
            'infoLink': book.info_url
        };
        if(book.thumbnail_url){
            standardBook.imageLink=book.thumbnail_url;
        }

        if (book.details.publishers) {
            standardBook.publisher = book.details.publishers[0];
        }
        else {
            standardBook.publisher = '';
        }

        if (book.details.authors) {
            book.details.authors.forEach(function (author) {
                standardBook.authors.push(author.name);
            });
        }
        else {
            standardBook.authors = 'Unknown';
        }

        if (book.details.languages) {
            book.details.languages.forEach(function (language) {
                switch (language.key) {
                case '/languages/eng':
                    standardBook.language = 'en';
                    break;
                case '/languages/spa':
                    standardBook.language = 'es';
                    break;
                case '/languages/fre':
                    standardBook.language = 'fr';
                    break;
                default:
                    standardBook.language = 'unknown';
                    break;
                }
            });
        }
        else {
            standardBook.language = 'unknown';
        }

        return standardBook;
    };

    var requestOptions = Object.assign({}, defaultOptions, {
        url: OPENLIBRARY_API_BASE + OPENLIBRARY_API_BOOK + '?bibkeys=ISBN:' + isbn + '&format=json&jscmd=details'
    });

    http.request(requestOptions).then(function (response) {
        //// Argument (response) is HttpResponse!
        if (response.statusCode !== 200) {
            callback(new Error('wrong response code: ' + response.statusCode));
        }

        var books = JSON.parse(response.content);
        var book = books['ISBN:' + isbn];
        console.log("open" + JSON.stringify(books))

        if (!book) {
            return callback(new Error('no books found with isbn: ' + isbn));
        }
        var standardBook = standardize(book)
        return callback(null, standardBook);
    }, function (e) {
        //// Argument (e) is Error!
        return callback(e);
    });

}

function _resolveWorldcat(isbn, callback) {

    var standardize = function standardize(book) {
        var standardBook = {
            "ISBN": isbn,
            'title': book.title,
            'publishedDate': book.year,
            'authors': [],
            'description': null,
            'industryIdentifiers': [],
            'pageCount': null,
            'printType': 'BOOK',
            'categories': [],
            'imageLink': "~/images/empty.png",
            'publisher': book.publisher
        };

        if (book.author) {
            standardBook.authors.push(book.author);
        }
        else {
            standardBook.authors = 'Unknown';
        }

        switch (book.lang) {
        case 'eng':
            standardBook.language = 'en';
            break;
        case 'spa':
            standardBook.language = 'es';
            break;
        case 'fre':
            standardBook.language = 'fr';
            break;
        default:
            standardBook.language = 'unknown';
            break;
        };

        return standardBook;
    };

    var requestOptions = Object.assign({}, defaultOptions, {
        url: WORLDCAT_API_BASE + WORLDCAT_API_BOOK + '/' + isbn + '?method=getMetadata&fl=*&format=json'
    });

    http.request(requestOptions).then(function (response) {
        //// Argument (response) is HttpResponse!
        if (response.statusCode !== 200) {
            return callback(new Error("wrong response code: " + response.statusCode));
        }

        let books = JSON.parse(response.content);
        console.log("cat" + JSON.stringify(books))

        if (books.stat !== "ok") {
            return callback(new Error("no books found with isbn: " + isbn));
        }

        let book = books.list[0];

        return callback(null, standardize(book));
    }, function (e) {
        //// Argument (e) is Error!
        return callback(e);
    });
}

function resolve(isbn, callback) {

    return _resolveOpenLibrary(isbn, (err, book) => {
        if (err) {
            return _resolveWorldcat(isbn, callback);
        }
        return callback(null, book);
    });
}
function onLogoTap(args) {
    var topmost = frameModule.topmost();
    var naviagationOptions = {
        moduleName: "pages/add-note/add-note-page",
    }
    topmost.navigate(naviagationOptions);
}exports.onLogoTap = onLogoTap;

exports.readISBN = readISBN;
exports.openQR = openQR;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
