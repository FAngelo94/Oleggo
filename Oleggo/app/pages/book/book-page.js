"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frameModule = require("ui/frame");
var Sqlite = require("nativescript-sqlite");
const BookViewModel = require("./book-view-model");
var imagepicker = require("nativescript-imagepicker");
var fs = require("tns-core-modules/file-system")
var Toast = require("nativescript-toast");

let page;
let dataBook;

var setMainState = Toast.makeText("Now the book is main active");
var setactiveState = Toast.makeText("Now the book is active");
var progressUpdate = Toast.makeText("Progress updated");

function loaded(args) {
    page = args.object;
     (new Sqlite("OleggoDB.db")).then((db) => {
        var temp = new BookViewModel(db, page.navigationContext.bookISBN)

        ////console.log(JSON.stringify(temp.Book))
        //console.log(JSON.stringify(temp.Dictionary))
        //console.log(JSON.stringify(temp.Quotes))
        dataBook = temp
        page.bindingContext = temp

        page.getViewById("tab-0").exports.getDataFromParent(page.navigationContext.bookISBN)
        page.getViewById("tab-2").exports.getDataFromParent(page.navigationContext.bookISBN)
   
        if (dataBook.Book.state == 0) {
            
            page.getViewById("btnState").text = "\uf097";
        }
        else {
            page.getViewById("btnState").text = "\uf02e";
            page.getViewById("btnState").style = "color:white"
            if (dataBook.Book.state == 2) {
                page.getViewById("btnState").style = "color:rgba(239,90,50,1)"
                page.getViewById("btnState").style = "background-color:whitesmoke;border-color:rgba(239,90,50,1);border-width: 4px"
            }
        }
        var lock = page.getViewById("lock");
        if (dataBook.Book.state == 2) { 
            //console.log("lock")
            lock.text = "\uf023";
        }
        else {
            //console.log("unlock")
            lock.text = "\uf09c"; 
        }
    }, err => {
        console.info("Failed to open database", err);
        errorAlert("Failed to open database: " + err)
    })
}

function readISBN() {
    return page.navigationContext.bookISBN
}

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

function onLogoTap(args) {

    var topmost = frameModule.topmost();
    var naviagationOptions={
        moduleName:"pages/add-note/add-note-page",
        transition: {
            name: "fade"
        }

    }
    topmost.navigate(naviagationOptions); 
}
exports.onLogoTap= onLogoTap;

function errorAlert(e) {
    dialogs.alert({
        title: "Error",
        message: e,
        okButtonText: "continue"
    }).then(() => {
        //console.log("Alert closed");
    });
}

function onSelectedIndexChanged(args) {
    const tabView = args.object;
    if (args.newIndex == 0) {
        page.getViewById("tab-" + args.newIndex).exports.onPageChange()
    }
}

function onDrawerButtonTap(args) {
    const sideDrawer = frameModule.topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

function onStateButtonTap(args) {

    switch (dataBook.Book.state) {
    case "0":
        dataBook.Book.state = "1"
        page.getViewById("btnState").text = "\uf02e";
		setactiveState.show()   
        break;
    case "1":
        dataBook.Book.state = "0"
        page.getViewById("btnState").text = "\uf097";
        break;
    case "2":
        MainActiveTap()
        dataBook.Book.state = "0"
        page.getViewById("btnState").text = "\uf097";
        page.getViewById("btnState").style = "color:white"
        break;
    }
    //console.log(dataBook.Book.state)
    dataBook.updateState(dataBook.Book)
}

function onProgressButtonTap(args) {

    args.object.animate({
        opacity: 0,
        duration: 100
    }).then(function () {
        // Drastically increase the size of the logo
        return args.object.animate({
            opacity: 1,
            duration: 100
        }).then(function(){
            var fullscreen = true
            var context = page.bindingContext._map.Book
        
            page.showModal("pages/book-progress/book-progress-page", context, function (newBookmark, set) {
                //console.log(newBookmark + "/" + set);
                if (set === true && newBookmark != "" && newBookmark > 0) {
                    if (parseInt(newBookmark) > parseInt(dataBook.Book.pages)) {
                        newBookmark = dataBook.Book.pages
                    }
                    progressUpdate.show()
                    dataBook.Book.bookmark = newBookmark
                    dataBook.Book.progress = Math.round((newBookmark / dataBook.Book.pages) * 100)
                    //console.log(JSON.stringify(page.bindingContext._map))
                    dataBook.updateBookmark(dataBook.Book)
                }
        
            }, fullscreen);
        })
    })
    


}

function onImageTap(args) {
    
    
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
                            var imageLink = fs.knownFolders.documents().path + "/" + String(page.navigationContext.bookISBN) + ".png"
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
                            //console.log(imageLink)
                            dataBook.Book.imagelink = imageLink
                            dataBook.Book.background = imageLink
                            //console.log(JSON.stringify(dataBook.Book))
                            dataBook.updateImageLink(imageLink, page.navigationContext.bookISBN)

                            console.info("saved complete");
                        });
                }
                else {
                    imageSrc.visibility = 'hidden';
                }
            });
            list.items = selection;
        }).catch(function (e) {
            //console.log(e);
        });
}

function onLogoTap(args) {
    
    
    var topmost = frameModule.topmost();
    var naviagationOptions = {
        moduleName: "pages/add-note/add-note-page",
        transition: {
            name: "fade",
            curve: "easeInOut"
        }
    }
    topmost.navigate(naviagationOptions);
}

function getDataFromParent(args) {
    //console.log(args)
}

function MainActiveTap(args) {
    var lock = page.getViewById("lock");
    if (dataBook.Book.state == "2"){
        lock.text = "\uf09c";
        dataBook.Book.state = "1"
        dataBook.updateMainState(dataBook.Book)
        //console.log("lock"+dataBook.Book.state)
        page.getViewById("btnState").text = "\uf02e";
        page.getViewById("btnState").style = "background-color:rgba(239,90,50,0)"
        page.getViewById("btnState").style = "color:white;border-width: 0px"

    }
    else{
        dataBook.updateMainState(dataBook.Book)
        lock.text = "\uf023";
        dataBook.Book.state = "2"
        page.getViewById("btnState").text = "\uf02e";
        page.getViewById("btnState").style = "color:rgba(239,90,50,1)" 
        page.getViewById("btnState").style = "background-color:whitesmoke;border-color:rgba(239,90,50,1);border-width: 4px"
        //console.log(dataBook.Book.state) 
        setMainState.show()     
    }
    dataBook.updateState(dataBook.Book) 
}

exports.readISBN = readISBN;
exports.getDataFromParent = getDataFromParent;
exports.onLogoTap = onLogoTap;
exports.MainActiveTap = MainActiveTap;
exports.onProgressButtonTap = onProgressButtonTap;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.onStateButtonTap = onStateButtonTap;
exports.onImageTap = onImageTap;
exports.onSelectedIndexChanged = onSelectedIndexChanged;
