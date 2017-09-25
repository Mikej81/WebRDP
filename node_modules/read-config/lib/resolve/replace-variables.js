'use strict';

const resolveExpression = require('./resolve-expression');

module.exports = replaceVariables;

function replaceVariables(marker, config, values, opts) {
    return resolve('', config, marker, values, opts || {});
}

function resolve(prop, config, marker, values, opts) {
    let result;
    if (typeof config === 'string') {
        result = resolveExpression(prop, config, marker, values, opts);
    } else if (Array.isArray(config)) {
        result = [];
        prop += prop.length ? '.' : '';
        config.forEach((item, idx) => {
            result.push(resolve(prop + idx, item, marker, values, opts));
        });
    } else if (typeof config === 'object' && config !== null && config !== undefined) {
        result = {};
        prop += prop.length ? '.' : '';
        Object.keys(config).forEach((key) => {
            result[key] = resolve(prop + key, config[key], marker, values, opts);
        });
    } else {
        result = config;
    }
    return result;
}
