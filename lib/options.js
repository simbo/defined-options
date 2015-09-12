'use strict';

var Option = require('./option.js'),
    is = require('./is-type.js'),
    validateValue = require('./validate-value.js');

function Options(definitions) {
    Object.defineProperty(this, '__options', {value: {}});
    this.defineOptions(definitions);
}

Options.prototype.defineOption = function(name, defs) {
    var definition = name;
    if (is['object!empty'](defs)) {
        definition = defs;
        definition.name = name;
    }
    var option = new Option(definition);
    this.removeOption(option.name)
        .__options[option.name] = option;
    Object.defineProperty(this, option.name, {
        get: function() {
            return this.__options[option.name].value;
        },
        set: function(value) {
            this.__options[option.name].value = value;
        },
        configurable: true,
        enumerable: true
    });
    return this;
};

Options.prototype.defineOptions = function(definitions) {
    definitions = is['object{}'](definitions) ? definitions : {};
    Object.keys(definitions).forEach(function(optionName) {
        this.defineOption(optionName, definitions[optionName]);
    }.bind(this));
    return this;
};

Options.prototype.removeOption = function(optionName) {
    if (this.hasOption(optionName)) {
        delete this[optionName];
        delete this.__options[optionName];
    }
    return this;
};

Options.prototype.hasOption = function(optionName) {
    return this.hasOwnProperty(optionName) && this.__options.hasOwnProperty(optionName) ?
        true : false;
};

Options.prototype.getPlainObject = function() {
    return Object.keys(this).reduce(function(options, optionName) {
        options[optionName] = this[optionName];
        return options;
    }.bind(this), {});
};

Options.prototype.mergeOptionValues = function() {
    var args = arguments;
    Object.keys(arguments).forEach(function(i) {
        var values = is.object(args[i]) ? args[i] : {};
        Object.keys(values).filter(function(optionName) {
            return this.hasOption(optionName);
        }.bind(this)).forEach(function(optionName) {
            this[optionName] = values[optionName];
        }.bind(this));
    }.bind(this));
    return this;
};

Options.prototype.mergeOptions = function() {
    var args = arguments;
    Object.keys(args).forEach(function(i) {
        var options = is.object(args[i]) ? args[i] : {};
        if (options.constructor === this.constructor) {
            var definitions = options.getOptionDefinitions();
            this.defineOptions(Object.keys(definitions).reduce(function(opts, optionName) {
                opts[optionName] = Object.keys(Option.properties).reduce(function(opt, propertyName) {
                    opt[propertyName] = definitions[optionName][propertyName];
                    return opt;
                }, {});
                return opts;
            }, {}));
        }
    }.bind(this));
    return this;
};

Options.prototype.getOptionDefinition = function(optionName) {
    return this.__options[optionName];
};

Options.prototype.getOptionDefinitions = function() {
    return this.__options;
};

Options.prototype.setDefaultOptionValue = function(optionName) {
    if (this.hasOption(optionName)) {
        this[optionName] = this.__options[optionName].default;
    }
    return this;
};

Options.prototype.setDefaultOptionValues = function() {
    Object.keys(this.__options).forEach(this.setDefaultOptionValue.bind(this));
    return this;
};

Options.prototype.validateOptionValue = function(optionName, value) {
    return validateValue(this.__options[optionName].validate, value);
};

Options.prototype.validateOptionValues = function(values, ignoreUnknown) {
    values = values === undefined ? this.getPlainObject() : values;
    ignoreUnknown = ignoreUnknown === undefined ? false : true;
    return is.object(values) && Object.keys(values).every(function(optionName) {
        return (!this.hasOption(optionName) && ignoreUnknown) ||
            (this.hasOption(optionName) && this.validateOptionValue(optionName, values[optionName]));
    }.bind(this));
};

module.exports = Options;