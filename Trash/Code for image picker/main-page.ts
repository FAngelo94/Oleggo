import { EventData } from 'tns-core-modules/data/observable';
import { Page } from 'tns-core-modules/ui/page';
import { isAndroid } from "tns-core-modules/platform";
import * as imagepicker from "nativescript-imagepicker";
import * as fs from "tns-core-modules/file-system";

let list;
let imageSrc;

export function pageLoaded(args: EventData) {
    let page = <Page>args.object;
    list = page.getViewById("urls-list");
    imageSrc = page.getViewById("imageSrc");
}

export function onSelectMultipleTap(args) {
    var path = fs.path.join(fs.knownFolders.documents().path, "Bella");
	var folder = fs.Folder.fromPath(path);
    console.info(path);
    console.info(folder);
	console.info(fs.knownFolders.documents().path);
	console.info(fs.knownFolders.documents());
	console.info(fs.knownFolders.path);
	console.info(fs.path)
	console.info("folder created");
}

export function onSelectSingleTap(args) {
    let context = imagepicker.create({ mode: "single" });
    startSelection(context, true);
}

function startSelection(context, isSingle) {
    context
        .authorize()
        .then(function() {
            list.items = [];
            return context.present();
        })
        .then(function(selection) {
            console.info("Selection done:");
            selection.forEach(function(selected) {
                console.info("----------------");
                console.info("uri: " + selected.uri);
                if (isSingle) {
                    selected.getImage({ maxWidth: 200, maxHeight: 200, aspectRatio: 'fill' })
                    .then((imageSource) => {
                        imageSrc.src = imageSource;
						console.info("SRC="+selected);
						                    console.info(imageSource.saveToFile("/data/user/0/org.nativescript.imagepickerdemo/prova.jpg", "jpg"));
						console.info("saved complete");
					});
                } else {
                    imageSrc.visibility = 'hidden';
                }
            });
            list.items = selection;
        }).catch(function (e) {
            console.log(e);
        });
}