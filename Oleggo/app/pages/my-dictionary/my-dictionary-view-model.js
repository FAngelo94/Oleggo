const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;

function MyDictionaryViewModel(db) {
    //Pass the ObservableArray to the page
    const viewModel = observableModule.fromObject({
		DictionaryList: new ObservableArray([])
    })
	var temp=readDictionaryDB(db)
	viewModel.DictionaryList=viewModel.DictionaryList.concat(temp)
	console.info(JSON.stringify(viewModel.DictionaryList))
    return viewModel
}

function readDictionaryDB(db)
{
	var quotes = []
    db.all("SELECT * FROM dictionary group by word order by word", function (error, rows) {
        if (error) {
            console.log("SELECT ERROR", error)
            return ("SELECT ERROR" + error)
        }
        else {
            for (var row in rows) {
                console.log("RESULT", rows[row])
                console.log(rows[row])
                var res = (rows[row].toString()).split(",")
                var quote = {
					word:res[2],
					meaning:res[3]
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
