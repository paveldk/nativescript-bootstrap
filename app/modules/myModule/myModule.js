var load = require("../../.framework/loader").load,
    sampleService = load("sampleService"),
    viewModel = require("./authentication-view-model"),
    frameModule = require("ui/frame");

function pageLoaded(args) {
    var page = args.object;

    page.bindingContext = viewModel.mainViewModel;

    sampleService.sampleFunction();

    viewModel.mainViewModel.set("message", "Hello World");
}

exports.pageLoaded = pageLoaded;
