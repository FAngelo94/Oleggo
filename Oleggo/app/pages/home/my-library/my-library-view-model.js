const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;

function MyLibraryViewModel() {
    const viewModel = observableModule.fromObject({
		BookList: new ObservableArray(
        [{
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
        ])
    });

    return viewModel;
}

function readDB()
{
	/* var db_promise = new Sqlite("DB", function(err, db) {
		if (err) {
		  console.info("We failed to open database", err);
		} else {
		  // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
		  console.info("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
		}
	}); */
}

module.exports = MyLibraryViewModel;
