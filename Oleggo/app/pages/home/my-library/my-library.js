 const MyLibraryViewModel = require("./my-library-view-model");
 var Sqlite = require("nativescript-sqlite");

 let page;

 exports.loaded = function (args) {
     page = args.object;
     (new Sqlite("OleggoDB.db")).then((db) => {
         console.log("gotDB")
         var temp = new MyLibraryViewModel(db)
         console.log("hello")
         console.log(temp)
         page.bindingContext = temp
     }, err => {
         console.info("Failed to open database", err);
         errorAlert("Failed to open database: " + err)
     })
     // page.bindingContext = new MyLibraryViewModel();
 };
