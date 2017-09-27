'use strict';

var deep = require('./deep');

module.exports = function(marker, config, values) {
	var propertySeparator = '_',
		envConfigPrefix = marker + propertySeparator;

	Object.keys(values).filter(function(name) {
		return name.indexOf(envConfigPrefix) === 0 && name.length > envConfigPrefix.length;
	}).forEach(function(name) {
		var prop = name.substring(envConfigPrefix.length);
		deep.put(config, prop.split(propertySeparator), values[name]);
	});
	return config;
};
