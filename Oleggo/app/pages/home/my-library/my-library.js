/* const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;
let page;
let pageData = new observableModule.fromObject({
    BookList: new ObservableArray(
        [{
                title: "eggs",
                author: "julian",
                image: "res://breakfast1"
            },
            {
                title: "bread",
                author: "david",
                image: "~/images/empty.png"
            },
            {
                title: "cereal",
                author: "gallego",
                image: "res://book"
            },
            {
                title: "bread",
                author: "david",
                image: "~/images/empty.png"
            },
            {
                title: "eggs",
                author: "julian",
                image: "res://breakfast1"
            },
            {
                title: "cereal",
                author: "gallego",
                image: "res://book"
            },
            {
                title: "cereal",
                author: "gallego",
                image: "res://book"
            },
            {
                title: "bread",
                author: "david",
                image: "~/images/empty.png"
            },
            {
                title: "eggs",
                author: "julian",
                image: "res://breakfast1"
            },
            {
                title: "eggs",
                author: "julian",
                image: "res://breakfast1"
            },
            {
                title: "bread",
                author: "david",
                image: "~/images/empty.png"
            },
            {
                title: "cereal",
                author: "gallego",
                image: "res://book"
            }
        ])
});

exports.loaded = function (args) {
    page = args.object;
    page.bindingContext = pageData;
};
 */