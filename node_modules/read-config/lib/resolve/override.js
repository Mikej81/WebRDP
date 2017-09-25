'use strict';

const deep = require('./deep'),
    propertySeparator = '_';

module.exports = function(marker, config, values) {
    const envConfigPrefix = marker + propertySeparator;

    Object.keys(values)
        .filter((name) => {
            return name.indexOf(envConfigPrefix) === 0 && name.length > envConfigPrefix.length;
        }).forEach((name) => {
            const prop = name.substring(envConfigPrefix.length);
            deep.put(config, prop.split(propertySeparator), values[name]);
        });
    return config;
};
