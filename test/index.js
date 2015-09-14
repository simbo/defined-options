'use strict';

var assert = require('assert'),
    is = require('validate-by-shorthand');

var Options = require('..'),
    Option = Options.Option;

var fixtures = require('./fixtures.js');

describe('Option', function() {


    it('should create a valid instance from an option name string', function() {
        var option = new Option('foo');
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
        var option = new Option('foo');
        option.name = 'bar';
        assert.equal(option.name, 'bar');
        option.name = 1;
        assert.equal(option.name, 'bar');
    });

    it('should only change its validation test if new value is valid', function() {
        var option = new Option({
            name: 'foo',
            validate: 'string'
        });
        assert.equal(option.validate, 'string');
        option.validate = 1;
        assert.equal(option.validate, 'string');
        option.validate = function(value) {
            return value === 'boom';
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
        var option = new Option('foo');
        option.validate = 'string!empty';
        option.value = 'baz';
        assert.equal(option.value, 'baz');
        option.value = 1;
        assert.equal(option.value, 'baz');
        option.value = '';
        assert.equal(option.value, 'baz');
    });

    it('should only change its filter function and filter values when setting', function() {
        var option = new Option('foo');
        option.validate = 'number';
        option.filter = function(value) {
            return is('number', this.value) ? this.value + value : value;
        };
        option.value = 1;
        assert.equal(option.value, 1);
        option.value = 1;
        assert.equal(option.value, 2);
    });

    it('should call the given function to set the default value, if a function is set as default property in option definition', function() {
        var option = new Option({
            name: 'now',
            default: function() {
                return new Date(0);
            }
        });
        assert.deepEqual(option.value, new Date(0));
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

    describe('.defineOption()', function() {

        it('should create a new option', function() {
            var options = new Options(fixtures.initialOptions);
            options.defineOption('x', {default: 5});
            assert.equal(options.x, 5);
        });

        it('should redefine an option', function() {
            var options = new Options(fixtures.initialOptions);
            options.defineOption('foo', {validate: 'number', default: 1});
            assert.equal(options.foo, 1);
        });

        it('should throw an error when trying to define an option called \'__options\'', function() {
            var options = new Options(fixtures.initialOptions);
            assert.throws(function() {
                options.defineOption('__options');
            }, /TypeError: Cannot redefine property: __options/);
        });

        it('should allow to access current Options instance when using a function to set an option\'s default value', function() {
            var options = new Options({
                    foo: {
                        validate: 'string!empty',
                        default: 'bar'
                    },
                    fullFoo: {
                        validate: 'string',
                        default: function() {
                            return this.options.foo + '!!!';
                        }
                    }
                });
            assert.deepEqual(options.getPlainObject(), {
                foo: 'bar',
                fullFoo: 'bar!!!'
            });
        });

    });

    describe('.getOptionDefinition()', function() {

        it('should return an option definition', function() {
            var options = new Options(fixtures.initialOptions);
            assert.deepEqual(options.getOptionDefinition('foo'), new Option(fixtures.initialDefinitions.foo));
        });

        describe('option definition', function() {

            it('should have current Options instance as property', function() {
                var options = new Options(fixtures.initialOptions),
                    foo = options.getOptionDefinition('foo');
                assert.deepEqual(foo.options, options);
            });

        });

    });

    describe('.getOptionDefinitions()', function() {

        it('should return all option definitions', function() {
            var options = new Options(fixtures.initialOptions);
            assert.deepEqual(JSON.stringify(options.getOptionDefinitions()), JSON.stringify(fixtures.initialDefinitions));
        });

    });

    describe('.validateOptionValue()', function() {

        it('should validate a current option value if no second argument is given', function() {
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

    });

    describe('.validateOptionValues()', function() {

        it('should validate all current option values if no argument is given', function() {
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

    });

    describe('.validate()', function() {

        it('should work as alias for .validateOptionValues() if no argument is given', function() {
            var options = new Options(fixtures.initialOptions);
            options.defineOption('foo',  {
                validate: 'string!empty'
            });
            assert.equal(options.validate(), false);
            options.foo = 'bar';
            assert.equal(options.validate(), true);
        });

        it('should work as alias for .validateOptionValue() if option name is given', function() {
            var options = new Options(fixtures.initialOptions);
            options.defineOption('foo',  {
                validate: 'string!empty'
            });
            assert.equal(options.validate('foo'), false);
            options.foo = 'bar';
            assert.equal(options.validate('foo'), true);
        });

    });

    describe('.mergeOptionValues()', function() {

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

    });

    describe('.merge()', function() {

        it('should work as alias for .mergeOptionValues()', function() {
            var options = new Options(fixtures.initialOptions);
            var bla = {
                answer: 13
            };
            options.merge(bla);
            assert.deepEqual(options.getPlainObject(), {
                answer: 13,
                foo: 'bar'
            });
            options.answer = 5;
        });

    });

    describe('.mergeOptions()', function() {

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

    });

    describe('.setDefaultOptionValue()', function() {

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

    });

    describe('.setDefaultOptionValues()', function() {

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

    });

    describe('.default()', function() {

        it('should work as alias for .setDefaultOptionValues() if no argument is given', function() {
            var options = new Options(fixtures.initialOptions);
            options.foo = 'baz';
            options.answer = 7;
            assert.deepEqual(options.getPlainObject(), {
                answer: 7,
                foo: 'baz'
            });
            options.default();
            assert.deepEqual(options.getPlainObject(), {
                answer: 42,
                foo: 'bar'
            });
        });

        it('should work as alias for .setDefaultOptionValue() if an option name is given', function() {
            var options = new Options(fixtures.initialOptions);
            options.answer = 7;
            assert.deepEqual(options.getPlainObject(), {
                foo: 'bar',
                answer: 7,
            });
            options.default('answer');
            assert.deepEqual(options.getPlainObject(), {
                foo: 'bar',
                answer: 42
            });
        });

    });

});
