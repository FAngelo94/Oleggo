const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require("nativescript-sqlite");

var DB = require("~/shared/db/db")

function BookViewModel(database, isbn) {
    //console.log("Model");
    let viewModeldata = {
        Book: {},
        Quotes: new ObservableArray([]),
        Dictionary: new ObservableArray([]),
        QuotesLength: {},
        DiccLength: {}
    }

    //viewModel.BookList = viewModel.BookList.concat(books2);
    var temp = readBooksDB(database, isbn)

    viewModeldata.Quotes = viewModeldata.Quotes.concat(readQuotesDB(database, isbn))
    viewModeldata.Dictionary = viewModeldata.Dictionary.concat(readDiccDB(database, isbn))
    viewModeldata.DiccLength = viewModeldata.Dictionary.length
    viewModeldata.QuotesLength = viewModeldata.Quotes.length
    viewModeldata.Book = temp

    var viewModel = observableModule.fromObjectRecursive(viewModeldata)
    viewModel.updateBookmark = function (data) {
        (new Sqlite("OleggoDB.db")).then(db => {
            // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
            //console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
            db.execSQL(DB.updateBookmark(), [data.bookmark, data.id]).then(id => {
                //console.log("UPDATE RESULT", id);
                db.all(DB.readAllBooks()).then(rows => {
                    for (var row in rows) {
                        //console.log("RESULT", rows[row]);
                    }
                }, error => {
                    //console.log("SELECT ERROR", error);
                });
            }, error => {
                //console.log("INSERT ERROR", error);
            });

        }, err => {
            //console.info("Failed to open database", err);
        })
    }
    viewModel.updateState = function (data) {
        (new Sqlite("OleggoDB.db")).then(db => {
            // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
            //console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
            db.execSQL(DB.updateState(), [data.state, data.id]).then(id => {
                //console.log("UPDATE RESULT", id);
                db.all(DB.readBookByID(), [data.id]).then(rows => {
                    for (var row in rows) {
                        //console.log("RESULT", rows[row]);
                    }
                }, error => {
                    //console.log("SELECT ERROR", error);
                });
            }, error => {
                //console.log("INSERT ERROR", error);
            });

        }, err => {
            //console.info("Failed to open database", err);
        })
    }
    viewModel.updateMainState = function (data) {
        (new Sqlite("OleggoDB.db")).then(db => {
            // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
            //console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
            db.all(DB.readISBNMainActiveBook()).then(rows => {
                for (var row in rows) {
                    //console.log("RESULT Main", rows[row]);
                    if(rows[row]){
                        viewModel.updateState({
                            id:rows[row][0],
                            state:1
                        })
                    }
                }
                viewModel.updateState({
                    id:data.id,
                    state:data.state
                })
            }, error => {
                //console.log("SELECT ERROR", error);
            });

        }, err => {
            //console.info("Failed to open database", err);
        })
    }
	viewModel.updateImageLink = function (imagelink, isbn) {
        (new Sqlite("OleggoDB.db")).then(db => {
            // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
            //console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
            db.execSQL("UPDATE books SET imagelink = ? WHERE ISBN = ?", [imagelink, isbn]).then(id => {
                //console.info("UPDATE RESULT");
                db.all("SELECT * FROM books WHERE ISBN=?", [isbn]).then(rows => {
                    for (var row in rows) {
                        //console.info("RESULT", rows[row]);
                    }
                }, error => {
                    //console.info("SELECT ERROR", error);
                });
            }, error => {
                //console.info("INSERT ERROR", error);
            });

        }, err => {
            //console.info("Failed to open database", err);
        })
    }
    return viewModel;
}

function readBooksDB(database, isbn) {
    var book = {}
    database.all(DB.readBookByISBN(), [isbn], function (error, rows) {
        if (error) {
            //console.log("SELECT ERROR", error);
            return ("SELECT ERROR" + error)
        }
        else {
            for (var row in rows) {
                //console.log("RESULT", rows[row]);

                var background
                if (rows[row][7].includes("M.jpg")) {
                    background = rows[row][7].replace("M.jpg", 'L.jpg');
                }
                else{
                    background = rows[row][7]
                }
                book = {
                    id: rows[row][0],
                    ISBN: rows[row][1],
                    title: rows[row][2],
                    author: rows[row][3],
                    pages: rows[row][4],
                    bookmark: rows[row][5],
                    state: rows[row][6],
                    imagelink: rows[row][7],
                    background: background,
                    progress: Math.round((Number(rows[row][5]) / Number(rows[row][4])) * 100)
                }
            }
            return book
            ////console.log(JSON.stringify(books))
        }
    })
    return book;
}

function readQuotesDB(database, isbn) {
    var quotes = []
    database.all(DB.readQuotesByISBN(), [isbn], function (error, rows) {
        if (error) {
            //console.log("SELECT ERROR", error);
            return ("SELECT ERROR" + error)
        }
        else {
            for (var row in rows) {
                //console.log("RESULT", rows[row])
                quote = {
                    quote: rows[row][2],
                    page: rows[row][3],
                    favorite: rows[row][4],
                    date: rows[row][5]
                }
                quotes.push(quote);
            }
            //console.log(rows.length)
            return quotes;
        }
    })
    return quotes;
}

function readDiccDB(database, isbn) {
    var dicc = []
    database.all(DB.readWordsByISBN(), [isbn], function (error, rows) {
        if (error) {
            //console.log("SELECT ERROR", error);
            return ("SELECT ERROR" + error)
        }
        else {
            for (var row in rows) {
                //console.log("RESULT", rows[row]);
                var res = (rows[row].toString()).split(",");
                word = {
                    word: rows[row][2],
                    meaning: rows[row][3],
                }

                dicc.push(word);
            }
            //console.log(rows.length)
            return dicc;
        }
    })
    return dicc;
}
module.exports = BookViewModel;
