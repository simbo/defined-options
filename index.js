'use strict';

var Options = require('./lib/options.js'),
    Option = require('./lib/option.js'),
    is = require('validate-by-shorthand');

module.exports = Options;
module.exports.Option = Option;
module.exports.is = is;
