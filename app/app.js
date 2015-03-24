var application = require("application"),
    loader = require("./.framework/loader");

// you can skip this :)
loader.prepare();

application.mainModule = "app/main-page";
application.start();
