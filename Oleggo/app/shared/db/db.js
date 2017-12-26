//QUOTE
function insertQuote(){
	return "INSERT INTO quotes (ISBN, Quote, Page, Favorite, Date) VALUES (?, ?, ?, ?, ?)";
}
exports.insertQuote = insertQuote

function updateQuote(){
	return "UPDATE quotes SET Quote = ? WHERE id = ?";
}
exports.updateQuote = updateQuote

function removeQuote(){
	return "DELETE FROM quotes WHERE id = ?";
}
exports.removeQuote = removeQuote

function removeFromFavoriteQuote(){
	return "UPDATE quotes SET Favorite = ? WHERE id = ?";
}
exports.removeFromFavoriteQuote = removeFromFavoriteQuote


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


//DICTIONARY
function insertNewWord(){
	return "INSERT INTO dictionary (ISBN, word, meaning) VALUES (?, ?, ?)";
}
exports.insertNewWord = insertNewWord

function readWords(){
	return "SELECT * FROM dictionary WHERE word LIKE ? group by word order by word";
}
exports.readWords = readWords

function deleteWord(){
	return "DELETE FROM dictionary WHERE word = ?";
}
exports.deleteWord = deleteWord
