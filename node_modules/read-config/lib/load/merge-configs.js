'use strict';

const merge = require('lodash').mergeWith;

module.exports = function(configs) {
    if (!configs || !configs.length) return {};
    return merge({}, ...configs, (a, b) => {
        return Array.isArray(a) ? b : undefined;
    });
};
