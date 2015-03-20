var mainViewModel,
    observable = require("data/observable");

mainViewModel = new observable.Observable();
mainViewModel.set("message", "Hello World!");

exports.mainViewModel = mainViewModel;
