'use strict';

const async = require('async'),
    mergeParents = require('./merge-parents'),
    mergeConfigs = require('./merge-configs');

module.exports.async = function(paths, opts, callback) {
    if (!callback) {
        callback = opts;
        opts = {};
    }
    paths = Array.isArray(paths) ? paths : [paths];
    async.map(paths, (filepath, asyncCallback) => {
        mergeParents.async(filepath, opts, (err, flatConfig) => {
            if (err) return asyncCallback(err);
            asyncCallback(null, flatConfig);
        });
    }, (err, flatConfigs) => {
        if (err) return callback(err);
        callback(null, mergeConfigs(flatConfigs));
    });
};

module.exports.sync = function(paths, opts) {
    let configs;
    paths = Array.isArray(paths) ? paths : [paths];
    configs = paths.map((path) => {
        return mergeParents.sync(path, opts);
    });
    return mergeConfigs(configs);
};
