var Loader,
    _consts,
    components,
    lodash = require("./libs/lodash.compat"),
    Class = require("./class");

_consts = {
    splitRegex: /(?=[A-Z])/
};

components = {
    base: {
        class: Class,
        lodash: lodash
    },
    service: {
        _basePath: "../services/"
    },
    provider: {
        _basePath: "../providers/"
    }
};

Loader = Class.extend({
    load: function(component) {
        var componentPath,
            componentName,
            componentType;

        if(!component) {
            throw new Error("Loader: load - missign component");
        }

        component = component.split(_consts.splitRegex);
        componentName = component[0];
        componentType = component[1];

        if(!componentName) {
            throw new Error("Loader: load - missing component name part");
        }

        if(components.base[componentName]) {
            return components.base[componentName];
        }

        if(!componentType) {
            throw new Error("Loader: load - missing component type");
        }

        componentType = componentType.toLowerCase();

        if(!components[componentType]) {
            throw new Error("Loader: load - requesting unknown component type");
        }

        if(components[componentType][componentName]) {
            return components[componentType][componentName];
        }

        componentPath = components[componentType]._basePath + componentName + "-" + componentType;

        try {
            component = require(componentPath);
            components[componentType][componentName] = component;
        } catch (variable) {
            throw new Error("Loader: load - requested component does not exist");
        }

        return component;
    },
});

module.exports = new Loader();
