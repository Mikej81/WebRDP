'use strict';

var deep = require('./deep'),
	path = require('path');

module.exports = function resolveValue(prop, value, marker, values, opts) {
	var escapedMarker = escapeRegExp(marker),
		fullFieldRegexp = new RegExp('^\\ *' + escapedMarker + '{\\ *([^' + escapedMarker + '}]+)\\ *}\\ *$'),
		partialFieldRegexp = new RegExp(escapedMarker + '{\\ *([^' + escapedMarker + '}]+)\\ *}', 'g'),
		expressionCheckRegexp = partialFieldRegexp,
		fullFieldMatch, result = value,
		partialFieldReplacer = function(a, b) {
			var resolved = resolveExpression(prop, b, values, opts);
			if (typeof resolved === 'object') {
				return JSON.stringify(resolved);
			}
			return resolved;
		};

	while(expressionCheckRegexp.test(result)) {
		fullFieldMatch = fullFieldRegexp.exec(value);
		if (fullFieldMatch !== null && fullFieldMatch.length > 1) {
			result = resolveExpression(prop, fullFieldMatch[1], values, opts);
		} else {
			result = value.replace(partialFieldRegexp, partialFieldReplacer);
		}
	}
	return result;
};

function resolveExpression(prop, expression, values, opts) {
	var exprChunks = expression.split('|'),
		exprValue = exprChunks[0],
		exprDefValue = exprChunks.length > 0 ? exprChunks[1] : null,
		resolvedProp = resolveRelativeProperty(prop, exprValue),
		pick = deep.pick(values, resolvedProp),
		result;
	if (pick) {
		result = pick.value;
	} else if (exprDefValue) {
		result = castDefaultValue(exprDefValue);
	} else if (!opts.skipUnresolved) {
		throw new Error('Unresolved configuration variable: ' + expression);
	} else {
		result = 'NOTFOUND:' + resolvedProp;
	}
	return result;
}

function castDefaultValue(value) {
	var trimmed = value.trim();
	if (typeof value !== 'string') {
		return value;
	} else if (/^\d+$/.test(trimmed)) {
		return parseInt(trimmed, 10);
	} else if (trimmed.toLowerCase() === 'true') {
		return true;
	} else if (trimmed.toLowerCase() === 'false') {
		return false;
	} else if (trimmed === 'undefined') {
		return undefined;
	} else if (trimmed === 'null') {
		return null;
	}
	return value;
}

function resolveRelativeProperty(propPath, relPath) {
	if (relPath.indexOf('../') === 0) relPath = '../' + relPath;
	else if (relPath.indexOf('./') === 0) relPath = '../' + relPath;
	else return relPath;
	return path.join(propPath.replace(/\./g, '/'), relPath)
		.replace(/\\/g, '.')
		.replace(/\//g, '.');
}

function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
