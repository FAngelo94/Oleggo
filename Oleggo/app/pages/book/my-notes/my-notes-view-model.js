const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;

function MyNotesViewModel(db) {
	//Pass the ObservableArray to the page
    const viewModel = observableModule.fromObject({
		NoteList: new ObservableArray([])
    })
	var temp=readQuotesDB(db)
	viewModel.NoteList=viewModel.NoteList.concat(temp)
	console.info(JSON.stringify(viewModel.NoteList))
    return viewModel
}


function readQuotesDB(db)
{
	var quotes = []
    db.all("SELECT * FROM quotes join books where quotes.ISBN=books.ISBN", function (error, rows) {
        if (error) {
            console.log("SELECT ERROR", error)
            return ("SELECT ERROR" + error)
        }
        else {
            for (var row in rows) {
                console.log("RESULT", rows[row])
                var res = (rows[row].toString()).split(",")
                var quote = {
                    book: res[8]+", page "+res[3],
					note:res[2],
					when:res[5],
					key:res[0]
                }
                quotes.push(quote);
				console.info(rows[row].toString())
                    
            }
            return quotes
        }
    })
    return quotes
}

module.exports = MyNotesViewModel;