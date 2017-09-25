'use strict';

const extnames = require('./parse').extnames,
    path = require('path'),
    async = require('async'),
    fs = require('fs');

module.exports.async = function(filepath, basedirs, callback) {
    if (typeof basedirs === 'function') {
        callback = basedirs;
        basedirs = [];
    }
    async.filter(lookupPaths(filepath, basedirs), fs.exists, (existingPaths) => {
        callback(existingPaths.length ? existingPaths[0] : null);
    });
};

module.exports.sync = function(filepath, basedirs) {
    let paths;
    basedirs = basedirs || [];
    paths = lookupPaths(filepath, basedirs).filter(fs.existsSync);
    return paths.length ? paths[0] : null;
};

function lookupPaths(filepath, basedirs) {
    const paths = [];
    if (!filepath) return paths;
    if (isAbsolute(filepath)) {
        return endsWith(filepath, extnames) ? [filepath] : addSupportedExtNames(filepath);
    }
    filepath = endsWith(filepath, extnames) ? [filepath] : addSupportedExtNames(filepath);
    basedirs.forEach((basedir) => {
        if (!basedir) return;
        filepath.forEach((fp) => {
            paths.push(path.resolve(basedir, fp));
        });
    });
    return paths;
}

function addSupportedExtNames(filepath) {
    return extnames.map((extname) => {
        return `${filepath}.${extname}`;
    });
}

function isAbsolute(filepath) {
    return path.resolve(filepath) === path.normalize(filepath);
}

function endsWith(text, suffixes) {
    return suffixes.some((suffix) => {
        return text.length >= suffix.length && text.substr(text.length - suffix.length) === suffix;
    });
}
