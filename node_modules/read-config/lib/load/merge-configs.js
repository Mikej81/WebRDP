'use strict';

var merge = require('lodash').merge;

module.exports = function(configs) {
	if (!configs || !configs.length) return {};
	var result = configs.shift();
	while(configs.length) {
		result = mergeConfig(result, configs.shift());
	}
	return result;
};

function mergeConfig(c1, c2) {
	return merge(c1, c2, function(a, b) {
		return Array.isArray(a) ? b : undefined;
	});
}
