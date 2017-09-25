'use strict';

module.exports.pick = pick;
module.exports.put = put;

function pick(obj, prop) {
    const splitted = Array.isArray(prop) ? prop : prop.split('.');
    let lastProp = splitted.shift(),
        lastObj = obj;

    splitted.forEach((item) => {
        lastObj = (lastObj) ? lastObj[lastProp] : null;
        lastProp = item;
    });
    return (!lastObj || lastObj[lastProp] === undefined) ? null : {
        obj: lastObj,
        prop: lastProp,
        value: lastObj[lastProp]
    };
}

function put(obj, prop, value) {
    const splitted = Array.isArray(prop) ? prop : prop.split('.');
    let lastProp = splitted.shift(),
        lastObj = obj;

    splitted.forEach((item) => {
        lastObj[lastProp] = (lastObj[lastProp] === undefined) ? {} : lastObj[lastProp];
        lastObj = lastObj[lastProp];
        lastProp = item;
    });
    lastObj[lastProp] = value;
    return obj;
}
