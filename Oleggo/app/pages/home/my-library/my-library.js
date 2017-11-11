 const MyLibraryViewModel = require("./my-library-view-model");
 
 exports.loaded = function (args) {
	page = args.object;
    page.bindingContext = new MyLibraryViewModel();
 };
 
