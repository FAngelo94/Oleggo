const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require("nativescript-sqlite");

function ReadingBooksViewModel(database) {
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
    database.all("SELECT * FROM books WHERE state==1 OR state==2", function (error, rows) {
        if (error) {
            console.log("SELECT ERROR", error);
            return ("SELECT ERROR" + error)
        }
        else {
            for (var row in rows) {
                console.log("RESULT", rows[row]);
                var res = (rows[row].toString()).split(",");
                var book = {
                    id:res[0],
                    ISBN:res[1],
                    title: res[2],
                    author: res[3],
                    pages:res[4],
                    bookmark:res[5],
                    state:res[6],
                    imagelink: res[7]
                }
                books.push(book);
                    
            }
            return books
            //console.log(JSON.stringify(books))
        }
    })
    return books;
}

module.exports = ReadingBooksViewModel;
