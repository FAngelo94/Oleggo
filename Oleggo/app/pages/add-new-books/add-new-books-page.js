const frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
const AddNewBooksViewModel = require("./add-new-books-view-model");
var dialogs = require("ui/dialogs");
var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
var http = require("http");

const defaultOptions = {
    timeout: 2500,
    method: "GET"
};

const OPENLIBRARY_API_BASE = 'https://openlibrary.org';
const OPENLIBRARY_API_BOOK = '/api/books';

const WORLDCAT_API_BASE = 'http://xisbn.worldcat.org';
const WORLDCAT_API_BOOK = '/webservices/xid/isbn';

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

    const barcodescanner = new BarcodeScanner();

    barcodescanner.scan({
        formats: "QR_CODE,PDF_417", // Pass in of you want to restrict scanning to certain types
        cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
        cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
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
            console.info("Scan format: " + result.format);
            console.info("Scan text:   " + result.text);
            tryAddBook(resut.text);
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
    let page = args.object.page;
    let isbn = viewModule.getViewById(page, "isbn");
    console.info(isbn.text);
    resolve("9780545010221", (err, book) => {
        if (err) {
            console.log('Book not found' + err)
            tryAddBook(err)
        }
        else {
            console.log('Book found: ' + JSON.stringify(book))
            tryAddBook(book.title + "\nAuthor: " + book.authors)
        }
    });
}

function tryAddBook(data) {

    dialogs.alert({
        title: "Book response",
        message: data,
        okButtonText: "continue"
    }).then(() => {
        console.log("Alert closed");
    });

}
/* function jresolveGoogle(isbn) {
	console.log("entre")
	var requestOptions = Object.assign({}, defaultOptions, {
	  url: GOOGLE_BOOKS_API_BASE + GOOGLE_BOOKS_API_BOOK + '?q=isbn:' + isbn
	});
	console.log(JSON.stringify(requestOptions))
	http.request(requestOptions).then(function (response) {
	  //// Argument (response) is HttpResponse!
	  if (response.statusCode !== 200) {
		console.log('wrong response code: ' + response.statusCode);
	  }
  
	  var books = JSON.parse(body);
  
	  if (!books.totalItems) {
		console.log('no books found with isbn: ' + isbn);
	  }
  
	  // In very rare circumstances books.items[0] is undefined (see #2)
	  if (!books.items || books.items.length === 0) {
		console.log('no volume info found for book with isbn: ' + isbn);
	  }
  
	  var book = books.items[0].volumeInfo;
	  console.log( book);
  }, function (e) {
	  //// Argument (e) is Error!
	  console.log(e);
  });
} */
function _resolveOpenLibrary(isbn, callback) {
    console.log("entre")
    var standardize = function standardize(book) {
        var standardBook = {
            'title': book.details.title,
            'publishedDate': book.details.publish_date,
            'authors': [],
            'description': book.details.subtitle,
            'industryIdentifiers': [],
            'pageCount': book.details.number_of_pages,
            'printType': 'BOOK',
            'categories': [],
            'imageLinks': {
                'smallThumbnail': book.thumbnail_url,
                'thumbnail': book.thumbnail_url
            },
            'previewLink': book.preview_url,
            'infoLink': book.info_url
        };

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
            if (book.details.publishers)
                standardBook.authors = book.details.publishers[0]
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
        console.log(JSON.stringify(book))

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
            'title': book.title,
            'publishedDate': book.year,
            'authors': [],
            'description': null,
            'industryIdentifiers': [],
            'pageCount': null,
            'printType': 'BOOK',
            'categories': [],
            'imageLinks': {},
            'publisher': book.publisher
        };

        if (book.author) {
            standardBook.authors.push(book.author);
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

    return _resolveOpenLibrary(isbn, function (err, book) {
        if (err) {
            return _resolveWorldcat(isbn, callback);
        }
        return callback(null, book);
    });
}

exports.readISBN = readISBN;
exports.openQR = openQR;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
