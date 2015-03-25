var Loader,
    _consts,
    components,
    isPrepared = false,
    fs = require("file-system").knownFolders,
    currentAppFolder = fs.currentApp(),
    lodash = require("./libs/lodash.compat"),
    Class = require("./class");

_consts = {
    providersLocation: "/app/providers",
    componentsLocation: "/app/components",
    splitRegex: /(?=[A-Z])/,
    serviceSuffix: /\w*-service.js\b/
};

components = {
    base: {
        class: Class,
        lodash: lodash
    },
    provider: {
        _basePath: "..",
        _fileExtension: ".js",
        _suffix: /\w*-provider.js\b/
    },
    service: {
        _basePath: "../components",
        _fileExtension: ".js",
        _suffix: /\w*-service.js\b/
    }
};

function isComponent(file) {
    return components.provider._suffix.test(file.name) ||
        components.service._suffix.test(file.name);
}

function getComponentName(file) {
    var componentName,
        fileNameArray = file.name.split("-");

    componentName = fileNameArray[0];

    for (var i = 1, l = fileNameArray.length; i < l - 1; i++) {
        componentName = componentName + fileNameArray[i].charAt(0).toUpperCase() + fileNameArray[i].substr(1);
    }

    return componentName;
}

function loadComponents(componentFolder, componentType, isRoot) {
    var that = this;

    componentFolder.eachEntity(function (file) {
        var component,
            componentRoot,
            componentName = getComponentName(file);

        if (isComponent(file)) {
            componentRoot = isRoot ? componentFolder.name : componentName;

            try {
                component = require(components[componentType]._basePath + "/" + componentRoot + "/" +
                    file.name.slice(0, -components[componentType]._fileExtension.length));

                components[componentType][componentName] = component;
            } catch (variable) {
                throw new Error("Loader: preload - requested component does not exist - " + file.name);
            }
        }
    });
}

function loadProviders() {
    var isRoot = true,
        providersFolder = currentAppFolder.getFolder(_consts.providersLocation);

    loadComponents(providersFolder, "provider", isRoot);
}

function loadServices() {
    var isRoot = false,
        componentsFolder = currentAppFolder.getFolder(_consts.componentsLocation);

    componentsFolder.eachEntity(function (component) {
        var componentFolder = currentAppFolder.getFolder(_consts.componentsLocation + "/" + component.name);

        loadComponents(componentFolder, "service", isRoot);
    });
}

Loader = Class.extend({
    prepare: function () {
        if (isPrepared) {
            resolve(true);
        }

        loadProviders();
        loadServices();

        isPrepared = true;
    },

    load: function (component) {
        var componentPath,
            componentName,
            componentType;

        if (!component) {
            throw new Error("Loader: load - missign component");
        }

        component = component.split(_consts.splitRegex);
        componentName = component[0];
        componentType = component[1];

        if (!componentName) {
            throw new Error("Loader: load - missing component name part");
        }

        if (components.base[componentName]) {
            return components.base[componentName];
        }

        if (!componentType) {
            throw new Error("Loader: load - missing component type");
        }

        componentType = componentType.toLowerCase();

        if (!components[componentType]) {
            throw new Error("Loader: load - requesting unknown component type - " +
                componentType + "(" + componentName + ")");
        }

        if (!components[componentType][componentName]) {
            throw new Error("Loader: load - requested component does not exist - " + componentName);
        }

        return components[componentType][componentName];
    }
});

module.exports = new Loader();
