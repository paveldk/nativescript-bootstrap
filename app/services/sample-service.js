var MyService,
    _consts,
    load = require("../.framework/loader").load,
    _ = load("lodash"),
    Class = load("class"),
    dataProvider = load("dataProvider");

_consts = {
    message: "My First Message"
};

function privateFunction() {
    return _consts.message;
}

MyService = Class.extend({
    serviceFunction: function() {
        var bar = 5;

        dataProvider.providerFunction();

        return privateFunction(bar);
    }
});

module.exports = new MyService();
