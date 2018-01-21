//QUOTE
function insertQuote(){
	return "INSERT INTO quotes (ISBN, Quote, Page, Favorite, Date) VALUES (?, ?, ?, ?, ?)";
}
exports.insertQuote = insertQuote

function updateQuote(){
	return "UPDATE quotes SET Quote = ? WHERE id = ?";
}
exports.updateQuote = updateQuote
function updateFavoriteQuote(){
	return "UPDATE quotes SET Favorite = ? WHERE id = ?";
}
exports.updateFavoriteQuote = updateFavoriteQuote

function readQuotes(){
	return "SELECT * FROM quotes join books where quotes.ISBN=? AND quotes.ISBN=books.ISBN";
}
exports.readQuotes = readQuotes
function readFavoriteQuotes(){
	return "SELECT * FROM quotes join books where quotes.ISBN=books.ISBN and favorite=1";
}
exports.readFavoriteQuotes = readFavoriteQuotes
function readQuotesByISBN(){
	return "SELECT * FROM quotes WHERE ISBN=?";
}
exports.readQuotesByISBN = readQuotesByISBN

function removeQuote(){
	return "DELETE FROM quotes WHERE id = ?";
}
exports.removeQuote = removeQuote
function removeFromFavoriteQuote(){
	return "UPDATE quotes SET Favorite = ? WHERE id = ?";
}
exports.removeFromFavoriteQuote = removeFromFavoriteQuote

//DICTIONARY
function insertNewWord(){
	return "INSERT INTO dictionary (ISBN, word, meaning) VALUES (?, ?, ?)";
}
exports.insertNewWord = insertNewWord

function readWords(){
	return "SELECT * FROM dictionary WHERE word LIKE ? group by word order by word";
}
exports.readWords = readWords
function readISBNWords(){
	return "SELECT * FROM dictionary where ISBN=? group by word order by word";
}
exports.readISBNWords = readISBNWords
function readWordsByISBN(){
	return "SELECT * FROM dictionary WHERE ISBN=?";
}
exports.readWordsByISBN = readWordsByISBN

function deleteWord(){
	return "DELETE FROM dictionary WHERE word = ?";
}
exports.deleteWord = deleteWord
function deleteWordById(){
	return "DELETE FROM dictionary WHERE id = ?";
}
exports.deleteWordById = deleteWordById

//BOOKS
function readAllBooks(){
	return "SELECT * FROM books";
}
exports.readAllBooks = readAllBooks
function readAllActiveBooks(){
	return "SELECT * FROM books WHERE state==1 OR state==2";
}
exports.readAllActiveBooks = readAllActiveBooks
function readISBNMainActiveBook(){
	return "SELECT * FROM books WHERE state=2";
}
exports.readISBNMainActiveBook = readISBNMainActiveBook
function readBookByID(){
	return "SELECT * FROM books WHERE id=?";
}
exports.readBookByID = readBookByID
function readBookByISBN(){
	return "SELECT * FROM books WHERE ISBN=?";
}
exports.readBookByISBN = readBookByISBN

function updateBookmark(){
	return "UPDATE books SET bookmark=? WHERE id=?";
}
exports.updateBookmark = updateBookmark

function updateState(){
	return "UPDATE books SET state=? WHERE id=?";
}
exports.updateState = updateState