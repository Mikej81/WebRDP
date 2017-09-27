'use strict';

var async = require('async'),
	mergeParents = require('./merge-parents'),
	mergeConfigs = require('./merge-configs');

module.exports.async = function(paths, opts, callback) {
	if (!callback) {
		callback = opts;
		opts = {};
	}
	paths = Array.isArray(paths) ? paths : [paths];
	async.map(paths, function(filepath, asyncCallback) {
		mergeParents.async(filepath, opts, function(err, flatConfig) {
			if (err) return asyncCallback(err);
			asyncCallback(null, flatConfig);
		});
	}, function(err, flatConfigs) {
		if (err) return callback(err);
		callback(null, mergeConfigs(flatConfigs));
	});
};

module.exports.sync = function(paths, opts) {
	var configs;
	paths = Array.isArray(paths) ? paths : [paths];
	configs = paths.map(function(path) {
		return mergeParents.sync(path, opts);
	});
	return mergeConfigs(configs);
};
