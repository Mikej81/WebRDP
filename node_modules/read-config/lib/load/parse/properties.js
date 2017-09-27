'use strict';

var properties = require('properties'),
	path = require('path'),
	fs = require('fs'),
	options = {
		path: false,
		variables: false,
		vars: false,
		include: false,
		namespaces: true
	};

module.exports.load = load;
module.exports.loadSync = loadSync;
module.exports.parse = parse;
module.exports.parseSync = parseSync;

function load(filePath, callback) {
	filePath = path.resolve(filePath);
	fs.readFile(filePath, 'utf8', function(err, content) {
		if (err) return callback(err);
		parse(content, callback);
	});
}

function loadSync(filePath) {
	var content = fs.readFileSync(path.resolve(filePath), 'utf8');
	return parseSync(content);
}

function parse(content, callback) {
	if (!content || !content.trim().length) return callback(null, {});
	properties.parse(content, options, callback);
}

function parseSync(content) {
	if (content && !content.trim().length) return {};
	return properties.parse(content, options);
}
