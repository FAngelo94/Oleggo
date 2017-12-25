function insertQuote(){
	return "INSERT INTO quotes (ISBN, Quote, Page, Favorite, Date) VALUES (?, ?, ?, ?, ?)";
}

exports.insertQuote = insertQuote