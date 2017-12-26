const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require("nativescript-sqlite");

var DB = require("~/shared/db/db")

function MyLibraryViewModel(database) {
    console.log("Model");
    
    const viewModel = observableModule.fromObject({
        BookList: new ObservableArray([])
    });
    //viewModel.BookList = viewModel.BookList.concat(books2);
    var temp= readBooksDB(database)
    viewModel.BookList = viewModel.BookList.concat(temp)
    console.log(JSON.stringify(viewModel.BookList))
    return viewModel;
}

function readBooksDB(database) {

    var books = []
    database.all(DB.readAllBooks(), function (error, rows) {
        if (error) {
            console.log("SELECT ERROR", error);
            return ("SELECT ERROR" + error)
        }
        else {
            for (var row in rows) {
                console.log("RESULT", rows[row]);
                var book = {
                    id:rows[row][0],
                    ISBN:rows[row][1],
                    title: rows[row][2],
                    author: rows[row][3],
                    pages:rows[row][4],
                    bookmark:rows[row][5],
                    state:rows[row][6],
                    imagelink: rows[row][7]
                }
                books.push(book);
                    
            }
            return books
            console.log(JSON.stringify(books))
        }
    })
    return books;
}

module.exports = MyLibraryViewModel;
