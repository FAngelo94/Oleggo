const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require("nativescript-sqlite");

function MyLibraryViewModel(database) {
    console.log("Model");
    /* var books2 = [{
            title: "eggs",
            author: "julian",
            imagelink: "res://breakfast1"
        },
        {
            title: "bread",
            author: "david",
            imagelink: "~/images/empty.png"
        },
        {
            title: "cereal",
            author: "gallego",
            imagelink: "res://book"
        },
        {
            title: "bread",
            author: "david",
            imagelink: "~/images/empty.png"
        },
        {
            title: "eggs",
            author: "julian",
            imagelink: "res://breakfast1"
        },
        {
            title: "cereal",
            author: "gallego",
            imagelink: "res://book"
        },
        {
            title: "cereal",
            author: "gallego",
            imagelink: "res://book"
        },
        {
            title: "bread",
            author: "david",
            imagelink: "~/images/empty.png"
        },
        {
            title: "eggs",
            author: "julian",
            imagelink: "res://breakfast1"
        },
        {
            title: "eggs",
            author: "julian",
            imagelink: "res://breakfast1"
        },
        {
            title: "bread",
            author: "david",
            imagelink: "~/images/empty.png"
        },
        {
            title: "cereal",
            author: "gallego",
            imagelink: "res://book"
        }
    ] */
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
    database.all("SELECT * FROM books", function (error, rows) {
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

module.exports = MyLibraryViewModel;
