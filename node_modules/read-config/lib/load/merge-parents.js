'use strict';

const mergeConfigs = require('./merge-configs'),
    path = require('path'),
    parse = require('./parse'),
    ReadConfigError = require('../read-config-error'),
    resolvePath = require('./resolve-path');

module.exports.async = function(configPath, opts, callback) {
    opts = opts || {};
    resolvePath.async(configPath, [opts.basedir], (configResolvedPath) => {
        if (!configResolvedPath) {
            if (isOptional(configPath, opts)) return callback(null, {});
            return callback(configNotFound(configPath));
        }
        mergeParentsAsync(configResolvedPath, opts, callback);
    });
};

module.exports.sync = function(configPath, opts) {
    opts = opts || {};
    const configResolvedPath = resolvePath.sync(configPath, [opts.basedir]);
    if (!configResolvedPath) {
        if (isOptional(configPath, opts)) return {};
        throw configNotFound(configPath);
    }
    return mergeParentsSync(configResolvedPath, opts);
};

function mergeParentsAsync(configPath, opts, callback) {
    const parentField = opts.parentField;
    callback = callback || opts;

    loadAsync(configPath, opts, (err, config) => {
        if (err) return callback(err);
        const parentPathValue = parentField ? config[parentField] : null,
            mergeParentsAsyncCallback = function(err, flatParent) {
                if (err) return callback(err);
                const result = mergeConfigs([flatParent || {}, config]);
                if (parentField) delete result[parentField];
                callback(null, result);
            };
        if (!parentPathValue) return callback(null, config);
        resolvePath.async(parentPathValue, generateBasedirs(configPath, opts), (parentPath) => {
            if (!parentPath) {
                if (!isOptional(parentPathValue, opts)) return callback(parentConfigNotFound(parentPathValue, configPath));
                mergeParentsAsyncCallback(null, {});
            } else {
                mergeParentsAsync(parentPath, opts, mergeParentsAsyncCallback);
            }
        });
    });
}

function mergeParentsSync(configPath, opts) {
    const parentField = opts ? opts.parentField : null,
        config = loadSync(configPath, opts),
        parentPathValue = parentField ? config[parentField] : null,
        parentPath = resolvePath.sync(parentPathValue, generateBasedirs(configPath, opts));
    let parentConfig, result;
    if (!parentPathValue) return config;
    if (!parentPath) {
        if (!isOptional(parentPathValue, opts)) throw parentConfigNotFound(parentPathValue, configPath);
        result = config;
    } else {
        parentConfig = mergeParentsSync(parentPath, opts);
        result = mergeConfigs([parentConfig, config]);
    }
    if (parentField) delete result[parentField];
    return result;
}

function loadAsync(configPath, opts, callback) {
    resolvePath.async(configPath, [opts.basedir], (configResolvedPath) => {
        if (!configResolvedPath) {
            if (isOptional(configPath, opts)) return callback(null, {});
            return callback(configNotFound(configPath));
        }
        parse.load(configResolvedPath, callback);
    });
}

function loadSync(configPath, opts) {
    opts = opts || {};
    const configResolvedPath = resolvePath.sync(configPath, [opts.basedir]);
    if (!configResolvedPath) {
        if (isOptional(configPath, opts)) return {};
        throw configNotFound(configPath);
    }
    return parse.loadSync(configPath);
}

function isOptional(configPath, opts) {
    let optional = opts.optional;
    if (!optional) return false;
    if (!Array.isArray(optional)) optional = [optional];
    if (optional.indexOf(configPath) >= 0) return true;
    return optional.some((optional) => {
        if (optional.indexOf('*') >= 0) {
            // regex
            optional = escapeRegExp(optional);
            optional = optional.replace(/\\\*\\\*/, '.|').replace(/\\\*/, '[^/]*');
            return new RegExp(optional).test(configPath);
        }
        return false;
    });
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function generateBasedirs(configPath, opts) {
    return [path.dirname(configPath), process.env.PWD, opts && opts.basedir];
}

function configNotFound(configPath) {
    return new ReadConfigError(`Config file not found: ${configPath}`);
}

function parentConfigNotFound(parentPath, configPath) {
    return new ReadConfigError(`Parent config file not found \'${parentPath}\' for ${configPath}`);
}
