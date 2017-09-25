'use strict';

const replaceVariables = require('./replace-variables'),
    override = require('./override'),
    moduleName = '[read-config]',
    ReadConfigError = require('../read-config-error');

module.exports = function(config, opts) {
    opts = opts || {};
    config = override(opts.override, config, process.env);
    config = replaceEnvVariables(config, opts.replaceEnv, opts);
    config = replaceLocalVariables(config, opts.replaceLocal, opts);
    return config;
};

function replaceEnvVariables(config, marker, opts) {
    if (marker) {
        try {
            return replaceVariables(marker, config, process.env, opts);
        } catch (e) {
            throw new ReadConfigError(`${moduleName} Could not resolve environment variable. ${e.message}`);
        }
    } else {
        return config;
    }
}

function replaceLocalVariables(config, marker, opts) {
    if (marker) {
        try {
            return replaceVariables(marker, config, config, opts);
        } catch (e) {
            throw new ReadConfigError(`${moduleName} Could not resolve local variable. ${e.message}`);
        }
    } else {
        return config;
    }
}
