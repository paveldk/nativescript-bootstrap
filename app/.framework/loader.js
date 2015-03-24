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
    return new Promise(function (resolve) {
        var that = this;
        console.log("--------------------------------");
        console.log("in loading component");
        console.log(componentFolder.name);
        console.log(componentFolder.getEntities);
        console.log("--------------------------------");


        componentFolder.getEntities()
            .then(function (files) {
                console.log("--------------------------------");
                console.log("in files");
                console.log("--------------------------------");

                files.forEach(function (file) {
                    var component,
                        componentName;

                    if (isComponent(file)) {
                        componentName = isRoot ? componentFolder.name : getComponentName(file);

                        console.log("--------------------------------");

                        console.log("loading: " + components[componentType]._basePath + "/" + componentName + "/" +
                            file.name.slice(0, -components[componentType]._fileExtension.length));
                        console.log("--------------------------------");

                        try {
                            component = require(components[componentType]._basePath + "/" + componentName + "/" +
                                file.name.slice(0, -components[componentType]._fileExtension.length));
                            components[componentType][componentName] = component;
                            console.log("--------------------------------");
                            console.log("loadinged finally");
                            console.log("--------------------------------");
                        } catch (variable) {
                            throw new Error("Loader: load - requested component does not exist - " + file.name);
                        }
                    }
                    console.log("--------------------------------");
                    console.log("not loading: " + file.name);
                    console.log("--------------------------------");
                });
                console.log("RRRRREESSSOOOOOLLLLVVIIING");
                resolve(true);
            }, function (error) {
                // Failed to obtain folder's contents.
                console.log("--------------------------------");
                console.log(error.message);
                console.log("--------------------------------");
                resolve(true);
            });

        console.log("--------------------------------");
        console.log("THIIIIS ISSSS the end....");
        console.log("--------------------------------");
    });
}

function loadProviders() {
    return new Promise(function (resolve) {
        var isRoot = true,
            providersFolder = currentAppFolder.getFolder(_consts.providersLocation);

        loadComponents(providersFolder, "provider", isRoot)
            .then(function () {

                console.log("--------------------------------");
                console.log("providersLoaded");
                console.log("--------------------------------");
                resolve(true);
            });
    });
}

function loadServices() {
    return new Promise(function (resolve, reject) {
        var isRoot = false,
            componentsFolder = currentAppFolder.getFolder(_consts.componentsLocation);

        console.log("-------------folderche------------");
        console.log(componentsFolder.contains("authentication"));
        console.log("--------------------------------");

        componentsFolder.getEntities().then(function (components) {

            components.forEach(function (component) {
                var componentFolder = currentAppFolder.getFolder(_consts.componentsLocation + "/" + component.name);

                loadComponents(componentFolder, "service", isRoot)
                    .then(function () {
                        resolve(true);
                    });
            });

        });
    });
}

Loader = Class.extend({
    prepare: function () {
        return new Promise(function (resolve) {
            if (isPrepared) {
                resolve(true);
            }

            loadProviders().then(function () {
                loadServices().then(function () {
                    console.log("JEEEEROOOONIIIIIMOOOOO");
                    resolve(true);
                });
            });

            isPrepared = true;
        });
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
