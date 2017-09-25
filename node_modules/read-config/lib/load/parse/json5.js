'use strict';

const json5 = require('json5'),
    path = require('path'),
    fs = require('fs');

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
    const content = fs.readFileSync(path.resolve(filePath), 'utf8');
    return parseSync(content);
}

function parse(content, callback) {
    process.nextTick(() => {
        let result = '';
        if (!content || !content.trim().length) return callback(null, {});
        try {
            result = json5.parse(content);
        } catch (e) {
            return callback(e);
        }
        callback(null, result);
    });
}

function parseSync(content) {
    if (content && !content.trim().length) return {};
    return json5.parse(content);
}
