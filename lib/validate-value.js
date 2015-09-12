'use strict';

var is = require('./is-type.js');

function validateValue(validate, value) {
    return (is.string(validate) && is[validate.toLowerCase()](value)) ||
        (is.function(validate) && validate.call(this, value)) ||
        (is.regexp(validate) && is.string(value) && value.match(validate)) ||
        (is.array(validate) && validate.filter(function(v) {
            return is.string(v) || is.function(v) || is.regexp(v);
        }).reduce(function(test, v) {
            return test || validateValue(v, value);
        }, false));
}

module.exports = validateValue;
