const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require("nativescript-sqlite");

/* function MyLibraryViewModel() {
    var books = [{
            title: "eggs",
            author: "julian",
            image: "res://breakfast1"
        },
        {
            title: "bread",
            author: "david",
            image: "~/images/empty.png"
        },
        {
            title: "cereal",
            author: "gallego",
            image: "res://book"
        },
        {
            title: "bread",
            author: "david",
            image: "~/images/empty.png"
        },
        {
            title: "eggs",
            author: "julian",
            image: "res://breakfast1"
        },
        {
            title: "cereal",
            author: "gallego",
            image: "res://book"
        },
        {
            title: "cereal",
            author: "gallego",
            image: "res://book"
        },
        {
            title: "bread",
            author: "david",
            image: "~/images/empty.png"
        },
        {
            title: "eggs",
            author: "julian",
            image: "res://breakfast1"
        },
        {
            title: "eggs",
            author: "julian",
            image: "res://breakfast1"
        },
        {
            title: "bread",
            author: "david",
            image: "~/images/empty.png"
        },
        {
            title: "cereal",
            author: "gallego",
            image: "res://book"
        }
    ]
    const viewModel = observableModule.fromObject({
        BookList: new ObservableArray([])
    });
    viewModel.BookList=viewModel.BookList.concat(books)

    return viewModel;
} */

function MyLibraryViewModel(database) {
    console.log("Model");
    var books2 = [{
            title: "eggs",
            author: "julian",
            image: "res://breakfast1"
        },
        {
            title: "bread",
            author: "david",
            image: "~/images/empty.png"
        },
        {
            title: "cereal",
            author: "gallego",
            image: "res://book"
        },
        {
            title: "bread",
            author: "david",
            image: "~/images/empty.png"
        },
        {
            title: "eggs",
            author: "julian",
            image: "res://breakfast1"
        },
        {
            title: "cereal",
            author: "gallego",
            image: "res://book"
        },
        {
            title: "cereal",
            author: "gallego",
            image: "res://book"
        },
        {
            title: "bread",
            author: "david",
            image: "~/images/empty.png"
        },
        {
            title: "eggs",
            author: "julian",
            image: "res://breakfast1"
        },
        {
            title: "eggs",
            author: "julian",
            image: "res://breakfast1"
        },
        {
            title: "bread",
            author: "david",
            image: "~/images/empty.png"
        },
        {
            title: "cereal",
            author: "gallego",
            image: "res://book"
        }
    ]
    const viewModel = observableModule.fromObject({
        BookList: new ObservableArray([])
    });
    viewModel.BookList = viewModel.BookList.concat(books2);
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
                    title: res[2],
                    author: res[3],
                    image: res[7]
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
