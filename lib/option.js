'use strict';

var is = require('validate-by-shorthand');

var properties = {
    name: {
        validate: 'string!empty'
    },
    validate: {
        validate: ['string', 'string[]', 'regexp', 'function'],
        default: 'any'
    },
    filter: {
        validate: 'function',
        default: function(value) { return value; }
    },
    default: {
        validate: 'any',
        default: undefined
    }
};

function Option(definition, options) {
    definition = is('object', definition) ? definition : {name: definition};
    options = options && options.constructor && options.constructor.name === 'Options' ?
        options : undefined;
    var optionValue;
    Object.defineProperties(this,
        Object.keys(properties).reduce(function(props, propertyName) {
            var property = properties[propertyName],
                propertyValue;
            if (is(property.validate, definition[propertyName])) {
                propertyValue = definition[propertyName];
            } else if (property.hasOwnProperty('default')) {
                propertyValue = property.default;
            } else {
                throw new Error(
                    'no valid value for option property \'' +
                    propertyName + '\': ' + definition[propertyName]
                );
            }
            props[propertyName] = {
                get: function() {
                    return propertyValue;
                },
                set: function(val) {
                    if (is(property.validate, val)) {
                        propertyValue = val;
                    }
                },
                enumerable: true
            };
            return props;
        }.bind(this), {
            options: {
                value: options ? options : undefined
            },
            setDefault: {
                value: function() {
                    this.value = is('function', this.default) ?
                        this.default.call(this) : this.default;
                }
            },
            value: {
                get: function() {
                    return optionValue;
                },
                set: function(val) {
                    if (is.call(this, this.validate, val)) {
                        optionValue = this.filter(val);
                    }
                },
                enumerable: true
            }
        })
    );
    this.setDefault();
    Object.seal(this);
}

module.exports = Option;
module.exports.properties = properties;
