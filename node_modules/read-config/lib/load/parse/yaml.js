'use strict';

const yaml = require('js-yaml'),
    path = require('path'),
    fs = require('fs'),
    ReadConfigError = require('../../read-config-error');

module.exports.load = load;
module.exports.loadSync = loadSync;
module.exports.parse = parse;
module.exports.parseSync = parseSync;

function load(filePath, callback) {
    filePath = path.resolve(filePath);
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) return callback(err);
        parse(content, callback);
    });
}

function loadSync(filePath) {
    const resolvePath = path.resolve(filePath),
        content = fs.readFileSync(resolvePath, 'utf8');
    let result;
    try {
        result = parseSync(content);
    } catch (e) {
        throw new ReadConfigError(`Yaml Error. File: ${resolvePath}. Details: ${e.message}`);
    }
    return result;
}

function parse(content, callback) {
    process.nextTick(() => {
        let result;
        if (!content || !content.trim().length) return callback(null, {});
        content = normalizeContent(content);
        try {
            result = yaml.safeLoad(content);
        } catch (e) {
            return callback(e);
        }
        callback(null, result || {});
    });
}

function parseSync(content) {
    if (content && !content.trim().length) return {};
    content = normalizeContent(content);
    return yaml.safeLoad(content) || {};
}

function normalizeContent(content) {
    content = content.trim().replace(/\r\n/g, '\n');
    content = content.replace(/\r/g, '\n');
    content = content.replace(/\t/g, '  ');
    return content;
}
