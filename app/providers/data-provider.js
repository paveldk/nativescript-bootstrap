var appConfig = require("../app-config"),
    TelerikBackendServices = require("../lib/everlive.all.min");

module.exports = new TelerikBackendServices(appConfig.backendServicesApiKey);
