var mainViewModel,
    observable = require("data/observable");

mainViewModel = new observable.Observable();
mainViewModel.set("message", "Hello World!");

exports.mainViewModel = mainViewModel;

/* alternative

var MainViewModel,
    observable = require("data/observable");

MainViewModel = observable.Observable.extends({
    username: "",
    password: "",

    init: function() {
        observable.Observable.fn.init.apply(this, arguments);
    },

    onLogin: function() {
        console.log("MAAARCOOOOO");
    }
});

exports.mainViewModel = new MainViewModel();

*/
