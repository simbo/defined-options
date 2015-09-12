'use strict';

var util = require('util');

var mapUtilTests = {
        'array': 'isArray',
        'boolean': 'isBoolean',
        'null': 'isNull',
        'nullorundefined': 'isNullOrUndefined',
        'number': 'isNumber',
        'string': 'isString',
        'symbol': 'isSymbol',
        'undefined': 'isUndefined',
        'regexp': 'isRegExp',
        'object': 'isObject',
        'date': 'isDate',
        'error': 'isError',
        'function': 'isFunction',
        'primitive': 'isPrimitive',
        'buffer': 'isBuffer'
    },
    customTests = {
        any: function() {
            return true;
        },
        'string!empty': function(value) {
            return util.isString(value) && value.length > 0;
        },
        'array!empty': function(value) {
            return util.isArray(value) && value.length > 0;
        },
        'object!empty': function(value) {
            return util.isObject(value) && Object.keys(value).length > 0;
        },
        'number>0': function(value) {
            return util.isNumber(value) && value > 0;
        },
        'number>=0': function(value) {
            return util.isNumber(value) && value >= 0;
        },
        'number<0': function(value) {
            return util.isNumber(value) && value < 0;
        },
        'number<=0': function(value) {
            return util.isNumber(value) && value <= 0;
        },
        integer: function(value) {
            return util.isNumber(value) && value % 1 === 0;
        },
        float: function(value) {
            return util.isNumber(value) && value % 1 !== 0;
        }
    },
    excludeFromExtend = [
        'any',
        'null',
        'undefined',
        'nullorundefined'
    ],
    mapUtilTestKeys = Object.keys(mapUtilTests);

module.exports = mapUtilTestKeys.concat(Object.keys(customTests)).filter(function(type) {
    return excludeFromExtend.indexOf(type) === -1;
}).reduce(function(is, type) {
    is[type + '[]'] = function(values) {
        return util.isArray(values) && values.every(is[type]);
    };
    is[type + '{}'] = function(values) {
        return util.isObject(values) && Object.keys(values).every(function(key) {
            return is[type](values[key]);
        });
    };
    return is;
}, mapUtilTestKeys.reduce(function(is, type) {
    is[type] = util[mapUtilTests[type]];
    return is;
}, customTests));
