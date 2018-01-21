const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;

var DB = require("~/shared/db/db")

function MyDictionaryViewModel(db,isbn) {
    //Pass the ObservableArray to the page
    const viewModel = observableModule.fromObject({
		DictionaryList: new ObservableArray([])
    })
	var temp=readDictionaryDB(db,isbn)
	viewModel.DictionaryList=viewModel.DictionaryList.concat(temp)
	console.info(JSON.stringify(viewModel.DictionaryList))
    return viewModel
}

function readDictionaryDB(db,isbn)
{
	var quotes = []
    db.all(DB.readISBNWords(),[isbn], function (error, rows) {
        if (error) {
            console.log("SELECT ERROR", error)
            return ("SELECT ERROR" + error)
        }
        else {
            for (var row in rows) {
                var quote = {
                    id:rows[row][0],
					word:rows[row][2],
					meaning:rows[row][3]
                }
                quotes.push(quote);
				console.info(rows[row].toString())
                    
            }
            return quotes
        }
    })
    return quotes
}

module.exports = MyDictionaryViewModel;
