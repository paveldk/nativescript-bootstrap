var application = require("application"),
    loader = require("./.framework/loader");

loader.prepare().then(function () {
    application.mainModule = "app/main-page";
    application.start();
});

// if you don't want to use the loader just use
//    application.mainModule = "app/main-page";
//    application.start();
