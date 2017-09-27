'use strict';

var mergeConfigs = require('./merge-configs'),
	path = require('path'),
	parse = require('./parse'),
	resolvePath = require('./resolve-path');

module.exports.async = function(configPath, opts, callback) {
	opts = opts || {};
	resolvePath.async(configPath, [opts.basedir], function(configResolvedPath) {
		if (!configResolvedPath) {
			if (isOptional(configPath, opts)) return callback(null, {});
			return callback(configNotFound(configPath));
		}
		mergeParentsAsync(configResolvedPath, opts, callback);
	});
};

module.exports.sync = function(configPath, opts) {
	opts = opts || {};
	var configResolvedPath = resolvePath.sync(configPath, [opts.basedir]);
	if (!configResolvedPath) {
		if (isOptional(configPath, opts)) return {};
		throw configNotFound(configPath);
	}
	return mergeParentsSync(configResolvedPath, opts);
};

function isOptional(configPath, opts) {
	if (!opts.optional) return false;
	return opts.optional.indexOf(configPath) >= 0;
}

function mergeParentsAsync(configPath, opts, callback) {
	var parentField = opts.parentField;
	callback = callback || opts;

	loadAsync(configPath, opts, function(err, config) {
		if (err) return callback(err);
		var parentPathValue = parentField ? config[parentField] : null,
			mergeParentsAsyncCallback = function(err, flatParent) {
				if (err) return callback(err);
				var result = mergeConfigs([flatParent || {}, config]);
				if (parentField) delete result[parentField];
				callback(null, result);
			};
		if (!parentPathValue) return callback(null, config);
		resolvePath.async(parentPathValue, generateBasedirs(configPath, opts), function(parentPath) {
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
	var parentField = opts ? opts.parentField : null,
		config = loadSync(configPath, opts),
		parentPathValue = parentField ? config[parentField] : null,
		parentPath = resolvePath.sync(parentPathValue, generateBasedirs(configPath, opts)),
		parentConfig, result;
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
	resolvePath.async(configPath, [opts.basedir], function(configResolvedPath) {
		if (!configResolvedPath) {
			if (isOptional(configPath, opts)) return callback(null, {});
			return callback(configNotFound(configPath));
		}
		parse.load(configResolvedPath, function(err, config) {
			return callback(err, config);
		});
	});
}

function loadSync(configPath, opts) {
	opts = opts || {};
	var configResolvedPath = resolvePath.sync(configPath, [opts.basedir]);
	if (!configResolvedPath) {
		if (isOptional(configPath, opts)) return {};
		throw configNotFound(configPath);
	}
	return parse.loadSync(configPath);
}

function isOptional(configPath, opts) {
	var optional = opts.optional;
	if (!optional) return false;
	if (!Array.isArray(optional)) optional = [optional];
	if (optional.indexOf(configPath) >= 0) return true;
	return optional.some(function(optional) {
		if (optional.indexOf('*') >= 0) {
			// regex
			optional = escapeRegExp(optional);
			optional = optional.replace(/\\\*\\\*/, '.|').replace(/\\\*/, '[^/]*');
			return new RegExp(optional).test(configPath);
		}
		return false;
	});
}

function generateBasedirs(configPath, opts) {
	return [path.dirname(configPath), process.env.PWD, opts && opts.basedir];
}

function configNotFound(configPath) {
	return new Error('Config file not found \'' + configPath);
}

function parentConfigNotFound(parentPath, configPath) {
	return new Error('Parent config file not found \'' + parentPath + '\' for ' + configPath);
}

function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
