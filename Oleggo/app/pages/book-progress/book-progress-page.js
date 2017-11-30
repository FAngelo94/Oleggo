"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observableModule = require("data/observable");
var viewModule = require("ui/core/view");
var context;
var closeCallback;
var page;
var viewModel = new  observableModule.fromObject({
    id: "context.id",
    ISBN: "context.ISBN",
    title: "context.title",
    author: "context.author",
    pages: "context.pages",
    bookmark: "context.bookmark",
    state: "context.state",
    imagelink: "context.imagelink",
    background:"context.background",
    progress:"context.progress"
});
var usernameTextField;
var passwordTextField;
function onShownModally(args) {
    page = args.object;
    console.log("login-page.onShownModally, context: " + JSON.stringify(args.context));
    context = args.context;
    viewModel.id= context.id
    viewModel.ISBN= context.ISBN
    viewModel.title= context.title
    viewModel.author= context.author
    viewModel.pages= context.pages
    viewModel.bookmark= context.bookmark
    viewModel.state= context.state
    viewModel.imagelink= context.imagelink
    viewModel.background=context.background
    viewModel.progress=context.progress

    page.bindingContext=viewModel
    closeCallback = args.closeCallback;
}
exports.onShownModally = onShownModally;
/* function onLoaded(args) {
    console.log("login-page.onLoaded");
    page = args.object;
}
exports.onLoaded = onLoaded;
function onUnloaded() {
    console.log("login-page.onUnloaded");
}
exports.onUnloaded = onUnloaded; */

function onFinishButtonTap() {
    console.log("onFinishButtonTap");
    closeCallback(page.bindingContext._map.pages,true);
}

function onSetButtonTap() {
    console.log("onSetButtonTap");
    //viewModel.bookmark=page.getViewById("newBookmark").text
    //viewModel.progress=Math.round((viewModel.bookmark/viewModel.pages)*100)
    console.log(JSON.stringify(viewModel.get("bookmark")))
    closeCallback(page.getViewById("newBookmark").text,true);
}
exports.onSetButtonTap = onSetButtonTap;
exports.onFinishButtonTap = onFinishButtonTap