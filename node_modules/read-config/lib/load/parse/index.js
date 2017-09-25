'use strict';

const path = require('path'),
    defaultParser = require('./json5'),
    parsers = {
        'json': require('./json5'),
        'json5': require('./json5'),
        'yml': require('./yaml'),
        'yaml': require('./yaml'),
        'properties': require('./properties')
    };

module.exports.load = load;
module.exports.loadSync = loadSync;
module.exports.parse = parse;
module.exports.parseSync = parseSync;
module.exports.extnames = Object.keys(parsers);

function resolveParser(filename) {
    if (parsers[filename]) return parsers[filename];
    let extname = path.extname(filename);
    if (extname[0] === '.') {
        extname = extname.substring(1);
    }
    return parsers[extname] || defaultParser;
}

function load(filePath, callback) {
    const parser = resolveParser(filePath);
    parser.load(filePath, callback);
}

function loadSync(filePath) {
    const parser = resolveParser(filePath);
    return parser.loadSync(filePath);
}

function parse(format, content, callback) {
    const parser = resolveParser(format);
    parser.parse(content, callback);
}

function parseSync(format, content) {
    const parser = resolveParser(format);
    return parser.parseSync(content);
}
