'use strict';

var Options = require('./lib/options.js'),
    Option = require('./lib/option.js'),
    isType = require('./lib/is-type.js'),
    validateValue = require('./lib/validate-value.js');

module.exports = Options;
module.exports.Option = Option;
module.exports.isType = isType;
module.exports.validateValue = validateValue;
