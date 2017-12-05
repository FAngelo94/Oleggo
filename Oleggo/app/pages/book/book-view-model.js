const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require("nativescript-sqlite");



function BookViewModel(database, isbn) {
    console.log("Model");
    let viewModeldata = {
        Book: {},
        Quotes: new ObservableArray([]),
        Dictionary: new ObservableArray([]),
        QuotesLength:{},
        DiccLength:{}
    }
    
    //viewModel.BookList = viewModel.BookList.concat(books2);
    var temp = readBooksDB(database, isbn)

    viewModeldata.Quotes=viewModeldata.Quotes.concat(readQuotesDB(database, isbn))
    viewModeldata.Dictionary=viewModeldata.Dictionary.concat(readDiccDB(database, isbn))
    viewModeldata.DiccLength=viewModeldata.Dictionary.length
    viewModeldata.QuotesLength=viewModeldata.Quotes.length
    viewModeldata.Book = temp
   // console.log(JSON.stringify(viewModeldata))
    var viewModel= observableModule.fromObjectRecursive(viewModeldata)
    viewModel.updateBookmark= function (data) {
           (new Sqlite("OleggoDB.db")).then(db => {
            // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
            console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
            db.execSQL("UPDATE books SET bookmark=? WHERE id=?", [data.bookmark,data.id]).then(id => {
                console.log("UPDATE RESULT", id);
                db.all("SELECT * FROM books").then(rows => {
                    for (var row in rows) {
                        console.log("RESULT", rows[row]);
                    }
                }, error => {
                    console.log("SELECT ERROR", error);
                });
            }, error => {
                console.log("INSERT ERROR", error);
            });
    
        }, err => {
            console.info("Failed to open database", err);
        }) 
    }
    viewModel.updateState= function (data) {
        (new Sqlite("OleggoDB.db")).then(db => {
         // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
         console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
         db.execSQL("UPDATE books SET state=? WHERE id=?", [data.state,data.id]).then(id => {
             console.log("UPDATE RESULT", id);
             db.all("SELECT * FROM books WHERE id=?",[data.id]).then(rows => {
                 for (var row in rows) {
                     console.log("RESULT", rows[row]);
                 }
             }, error => {
                 console.log("SELECT ERROR", error);
             });
         }, error => {
             console.log("INSERT ERROR", error);
         });
 
     }, err => {
         console.info("Failed to open database", err);
     }) 
 }
    return viewModel;
}

function readBooksDB(database, isbn) {
    var book = {}
    database.all("SELECT * FROM books WHERE ISBN=?", [isbn], function (error, rows) {
        if (error) {
            console.log("SELECT ERROR", error);
            return ("SELECT ERROR" + error)
        }
        else {
            for (var row in rows) {
                console.log("RESULT", rows[row]);
               
                var res = (rows[row].toString()).split(",");
                var background
                if (res[7].includes("M.jpg")) {
                    console.log("si")
                    background = res[7].replace("M.jpg", 'L.jpg');
                }
                book = {
                    id: res[0],
                    ISBN: res[1],
                    title: res[2],
                    author: res[3],
                    pages: res[4],
                    bookmark: res[5],
                    state: res[6],
                    imagelink: res[7],
                    background:background,
                    progress:Math.round((Number(res[5])/Number(res[4]))*100)
                }
            }
            return book
            //console.log(JSON.stringify(books))
        }
    })
    return book;
}

function readQuotesDB(database, isbn) {
    var quotes = []
    database.all("SELECT * FROM quotes WHERE ISBN=?", [isbn], function (error, rows) {
        if (error) {
            console.log("SELECT ERROR", error);
            return ("SELECT ERROR" + error)
        }
        else {
            for (var row in rows) {
                console.log("RESULT", rows[row]);
                var res = (rows[row].toString()).split(",");
                quote = {
                    quote: res[2],
                    page: res[3],
                    favorite: res[4],
                    date: res[5]
                }
                quotes.push(quote);
            }
            console.log(rows.length)
            return quotes;
        }
    })
    return quotes;
}

function readDiccDB(database, isbn) {
    var dicc = []
    database.all("SELECT * FROM dictionary WHERE ISBN=?", [isbn], function (error, rows) {
        if (error) {
            console.log("SELECT ERROR", error);
            return ("SELECT ERROR" + error)
        }
        else {
            for (var row in rows) {
                console.log("RESULT", rows[row]);
                var res = (rows[row].toString()).split(",");
                word = {
                    word: res[2],
                    meaning: res[3],
                }

                dicc.push(word);
            }
            console.log(rows.length)
            return dicc;
        }
    })
    return dicc;
}
module.exports = BookViewModel;
