const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require("nativescript-sqlite");

function BookViewModel(database, isbn) {
    console.log("Model");
    const viewModel = observableModule.fromObject({
        Book: {},
        Quotes: new ObservableArray([]),
        Dictionary: new ObservableArray([]),
        QuotesLength:{},
        DiccLength:{}
    });
    //viewModel.BookList = viewModel.BookList.concat(books2);
    var temp = readBooksDB(database, isbn)
    viewModel.Quotes=viewModel.Quotes.concat(readQuotesDB(database, isbn))
    viewModel.Dictionary=viewModel.Dictionary.concat(readDiccDB(database, isbn))
    viewModel.DiccLength=viewModel.Dictionary.length
    viewModel.QuotesLength=viewModel.Quotes.length
    viewModel.Book = temp
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
                    id: res[0],
                    ISBN: res[1],
                    title: res[2],
                    author: res[3],
                    pages: res[4],
                    bookmark: res[5],
                    state: res[6],
                    imagelink: res[7],
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
                    id: res[0],
                    ISBN: res[1],
                    title: res[2],
                    author: res[3],
                    pages: res[4],
                    bookmark: res[5],
                    state: res[6],
                    imagelink: res[7]
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
