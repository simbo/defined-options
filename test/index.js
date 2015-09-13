'use strict';

var assert = require('assert'),
    is = require('validate-by-shorthand').isType;

var Options = require('..'),
    Option = Options.Option;

var fixtures = require('./fixtures.js');

describe('Option', function() {

    var option = new Option('foo');

    it('should create a valid instance from an option name string', function() {
        assert.equal(option.name, 'foo');
        assert.equal(option.validate, 'any');
        assert.equal(typeof option.filter, 'function');
        assert.equal(option.hasOwnProperty('default') && option.default === undefined, true);
        assert.equal(option.value, undefined);
    });

    it('should throw an error if no valid option name is given', function() {
        assert.throws(function() {
            new Option(1);
        }, /no valid value for option property 'name': 1/);
    });

    it('should change its name if new value is valid', function() {
        option.name = 'bar';
        assert.equal(option.name, 'bar');
        option.name = 1;
        assert.equal(option.name, 'bar');
    });

    it('should only change its validation test if new value is valid', function() {
        option.validate = 'string';
        assert.equal(option.validate, 'string');
        option.validate = 1;
        assert.equal(option.validate, 'string');
        option.validate = function(value) {
            return this.value === undefined;
        };
        assert.equal(typeof option.validate, 'function');
        option.value = 'boom';
        assert.equal(option.value, 'boom');
        option.value = 'bla';
        assert.equal(option.value, 'boom');
        option.validate = /^[0-9]+$/;
        option.value = '42';
        assert.equal(option.value, '42');
        option.value = 'bla';
        assert.equal(option.value, '42');
    });

    it('should only change its value if new value is valid according to given validation test', function() {
        option.validate = 'string!empty';
        option.value = 'baz';
        assert.equal(option.value, 'baz');
        option.value = 1;
        assert.equal(option.value, 'baz');
        option.value = '';
        assert.equal(option.value, 'baz');
    });

    it('should only change its filter function and filter values when setting', function() {
        option.validate = 'number';
        option.filter = function(value) {
            return is.number(this.value) ? this.value + value : value;
        };
        option.value = 1;
        assert.equal(option.value, 1);
        option.value = 1;
        assert.equal(option.value, 2);
    });

});

describe('Options', function() {

    it('should create a valid Options instance from Option definitions', function() {
        var options = new Options(fixtures.initialOptions);
        assert.deepEqual(options.getPlainObject(), {
            foo: 'bar',
            answer: 42
        });
    });

    it('should create an empty Options instance if no Option definitions are given', function() {
        assert.deepEqual(new Options(), {});
    });

    it('should only change an option value if new value is valid', function() {
        var options = new Options(fixtures.initialOptions);
        options.foo = '';
        assert.equal(options.foo, 'bar');
        options.foo = 'baz';
        assert.equal(options.foo, 'baz');
    });

    it('should also change option definition\'s value when changing an option value', function() {
        var options = new Options(fixtures.initialOptions);
        options.foo = 'baz';
        assert.equal(options.__options.foo.value, 'baz');
    });

    it('should redefine an option', function() {
        var options = new Options(fixtures.initialOptions);
        options.defineOption('foo', {validate: 'number', default: 1});
        assert.equal(options.foo, 1);
    });

    it('should return an option definition', function() {
        var options = new Options(fixtures.initialOptions);
        assert.deepEqual(options.getOptionDefinition('foo'), new Option(fixtures.initialDefinitions.foo));
    });

    it('should return all option definitions', function() {
        var options = new Options(fixtures.initialOptions);
        assert.deepEqual(JSON.stringify(options.getOptionDefinitions()), JSON.stringify(fixtures.initialDefinitions));
    });

    it('should validate a current option value', function() {
        var options = new Options(fixtures.initialOptions);
        options.defineOption('foo',  {
            validate: 'string!empty'
        });
        assert.equal(options.validateOptionValue('foo'), false);
        options.foo = 'bar';
        assert.equal(options.validateOptionValue('foo'), true);
    });

    it('should validate a persumable new option value', function() {
        var options = new Options(fixtures.initialOptions);
        assert.equal(options.validateOptionValue('foo', 'bar'), true);
        assert.equal(options.validateOptionValue('foo', 3), false);
    });

    it('should validate all current option values', function() {
        var options = new Options(fixtures.initialOptions);
        options.defineOption('foo',  {
            validate: 'string!empty'
        });
        assert.equal(options.validateOptionValues(), false);
        options.foo = 'bar';
        assert.equal(options.validateOptionValues(), true);
    });

    it('should test if properties of an given object contain valid persumable new option values', function() {
        var options = new Options(fixtures.initialOptions);
        assert.equal(options.validateOptionValues({
            foo: 'bar',
            answer: 13
        }), true);
        assert.equal(options.validateOptionValues({
            foo: 3
        }), false);
        assert.equal(options.validateOptionValues({
            foo: 'bar',
            not: 'here'
        }), false);
        assert.equal(options.validateOptionValues({
            foo: 'bar',
            not: 'here'
        }, true), true);
        assert.equal(options.validateOptionValues({}), true);
    });

    it('should merge a plain object of option values with current option values', function() {
        var options = new Options(fixtures.initialOptions);
        var bla = {
            answer: 13
        };
        options.mergeOptionValues(bla);
        assert.deepEqual(options.getPlainObject(), {
            answer: 13,
            foo: 'bar'
        });

        options.answer = 5;
    });

    it('should merge options of another Options instance with current options', function() {
        var options = new Options(fixtures.initialOptions);
        var opts = new Options(fixtures.additionalOptions);
        options.mergeOptions(opts);
        assert.deepEqual(options.getPlainObject(), {
            answer: 42,
            foo: 'baz',
            some: 'thing'
        });
    });

    it('should set a single option to its default value', function() {
        var options = new Options(fixtures.initialOptions);
        options.answer = 7;
        assert.deepEqual(options.getPlainObject(), {
            foo: 'bar',
            answer: 7,
        });
        options.setDefaultOptionValue('answer');
        assert.deepEqual(options.getPlainObject(), {
            foo: 'bar',
            answer: 42
        });
    });

    it('should set all options to their default value', function() {
        var options = new Options(fixtures.initialOptions);
        options.foo = 'baz';
        options.answer = 7;
        assert.deepEqual(options.getPlainObject(), {
            answer: 7,
            foo: 'baz'
        });
        options.setDefaultOptionValues();
        assert.deepEqual(options.getPlainObject(), {
            answer: 42,
            foo: 'bar'
        });
    });

    it('should throw an error when trying to define an option called \'__options\'', function() {
        var options = new Options(fixtures.initialOptions);
        assert.throws(function() {
            options.defineOption('__options');
        }, /TypeError: Cannot redefine property: __options/);
    });

});
