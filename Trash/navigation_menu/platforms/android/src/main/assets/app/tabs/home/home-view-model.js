const observableModule = require("data/observable");
const b = frameModule.topmost().getViewById("b");

function HomeViewModel() {
    const viewModel = observableModule.fromObject({
	
    });

    return viewModel;
}

b.on(buttonModule.Button.tapEvent, function (args: observable.EventData) {
    console.info("Hello World 2!");
});

module.exports = HomeViewModel;
