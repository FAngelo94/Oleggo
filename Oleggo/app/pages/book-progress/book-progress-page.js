"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observableModule = require("data/observable");
var viewModule = require("ui/core/view");
var context;
var closeCallback;
var page;
var usernameTextField;
var passwordTextField;
function onShownModally(args) {
    page = args.object;
    console.log("login-page.onShownModally, context: " + JSON.stringify(args.context));
    context = args.context;
    const viewModel = observableModule.fromObject({
        Book: context
    });
    page.bindingContext=viewModel
    closeCallback = args.closeCallback;
}
exports.onShownModally = onShownModally;
function onLoaded(args) {
    console.log("login-page.onLoaded");
    page = args.object;
}
exports.onLoaded = onLoaded;
function onUnloaded() {
    console.log("login-page.onUnloaded");
}
exports.onUnloaded = onUnloaded;

function onFinishButtonTap() {
    console.log("onFinishButtonTap");
    closeCallback(page.bindingContext._map.Book.pages,true);
}

function onSetButtonTap() {
    console.log("onSetButtonTap");
    closeCallback("pages.text",true);
}
exports.onSetButtonTap = onSetButtonTap;
exports.onFinishButtonTap = onFinishButtonTap