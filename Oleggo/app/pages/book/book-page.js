"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frameModule = require("ui/frame");
var Sqlite = require("nativescript-sqlite");
const BookViewModel = require("./book-view-model");
var imagepicker = require("nativescript-imagepicker");
var fs = require("tns-core-modules/file-system")

let page;
let dataBook;

function loaded (args) {
    page = args.object;
    (new Sqlite("OleggoDB.db")).then((db) => {
        var temp = new BookViewModel(db, page.navigationContext.bookISBN)
        //console.log(JSON.stringify(temp.Book))
        console.log(JSON.stringify(temp.Dictionary))
        console.log(JSON.stringify(temp.Quotes))
        dataBook=temp
        page.bindingContext = temp
        if(dataBook.Book.state==0){
            page.getViewById("btnState").style = "background-color:#FF4082"
        }
        else{
            page.getViewById("btnState").style = "background-color:white"
            if(dataBook.Book.state==2){
                page.getViewById("btnMain").style = "background-color:white"
            }
        }

    }, err => {
        console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
};

/* ***********************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
function onNavigatingTo(args) {
    /* ***********************************************************
     * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
     * Skipping the re-initialization on back navigation means the user will see the
     * page in the same data state that he left it in before navigating.
     *************************************************************/
    if (args.isBackNavigation) {
        return;
    }
    loaded(args)
    //TODO corregir para cuando llegue

    // page.bindingContext = new BookViewModel();
}

function errorAlert(e) {
    dialogs.alert({
        title: "Error",
        message: e,
        okButtonText: "continue"
    }).then(() => {
        console.log("Alert closed");
    });
}

function onSelectedIndexChanged(args) {
    const tabView = args.object;
    /*   const bindingContext = tabView.bindingContext;
      const selectedTabViewItem = tabView.items[args.newIndex];

      bindingContext.set("title", selectedTabViewItem.title); */
}
/* ***********************************************************
 * According to guidelines, if you have a drawer on your page, you should always
 * have a button that opens it. Get a reference to the RadSideDrawer view and
 * use the showDrawer() function to open the app drawer section.
 *************************************************************/
function onDrawerButtonTap(args) {
    const sideDrawer = frameModule.topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}
function onStateButtonTap(args){

    
    if(dataBook.Book.state==1 || dataBook.Book.state==2){
        dataBook.Book.state = 0
        page.getViewById("btnState").style = "background-color:#FF4082"
        page.getViewById("btnMain").style = "background-color:#FF4082"
    }
    else{
        dataBook.Book.state = 1
        page.getViewById("btnState").style = "background-color:white"
    }
    console.log(dataBook.Book.state)  
    dataBook.updateState(dataBook.Book)
}

function onProgressButtonTap(args) {

    var fullscreen = true
    var context=page.bindingContext._map.Book

    page.showModal("pages/book-progress/book-progress-page", context, function (newBookmark, set) {
        console.log(newBookmark + "/" + set);
        if(set===true && newBookmark!=""){
            dataBook.Book.bookmark=newBookmark
            dataBook.Book.progress=Math.round((newBookmark/dataBook.Book.pages)*100)
            console.log(JSON.stringify(page.bindingContext._map))
            dataBook.updateBookmark(dataBook.Book)
        }
            
    }, fullscreen);
}
function onMainButtonTap(args) {
    
    if(dataBook.Book.state!=2){
        dataBook.Book.state = 2
        page.getViewById("btnState").style = "background-color:white"
        page.getViewById("btnMain").style = "background-color:white"
    }
    else{
        dataBook.Book.state = 1
        page.getViewById("btnState").style = "background-color:white"
        page.getViewById("btnMain").style = "background-color:#FF4082"
    }

    console.log(dataBook.Book.state)  
    dataBook.updateMainState(dataBook.Book)
    dataBook.updateState(dataBook.Book)
}

function changeImageBook(args){
	console.info("INIZIO")
	var context = imagepicker.create({ mode: "single" });
	console.info(context)
    startSelection(context, true);
}

function startSelection(context, isSingle) {
    console.info("start select")
	context
        .authorize()
        .then(function () {
        //list.items = [];
        return context.present();
    })
        .then(function (selection) {
        console.info("Selection done:");
        selection.forEach(function (selected) {
            console.info("----------------");
            console.info("uri: " + selected.uri);
            if (isSingle) {
                selected.getImage({ maxWidth: 200, maxHeight: 200, aspectRatio: 'fill' })
                    .then(function (imageSource) {
                    //imageSrc.src = imageSource;
					var imageLink = fs.knownFolders.documents().path+"/"+String(page.navigationContext.bookISBN)+".png"
					console.info(imageSource.name)
					console.info(imageSource)
					
					var documents = fs.knownFolders.documents();
					var file = documents.getFile(imageLink);
					file.remove()
						.then(function (result) {
							console.info(imageSource.saveToFile(imageLink, "png"))
							console.info("image updated")
						}, function (error) {
							// Failed to remove the file.
						});
                    dataBook.updateImageLink(imageLink,page.navigationContext.bookISBN)
					
					console.info("saved complete");
                });
            }
            else {
                imageSrc.visibility = 'hidden';
            }
        });
        list.items = selection;
    }).catch(function (e) {
        console.log(e);
    });
}

exports.changeImageBook = changeImageBook
exports.onProgressButtonTap = onProgressButtonTap;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.onMainButtonTap= onMainButtonTap;
exports.onStateButtonTap = onStateButtonTap;
exports.onSelectedIndexChanged = onSelectedIndexChanged;
