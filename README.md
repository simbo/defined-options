defined-options
===============

  > Define option properties with optional validation, filter and default value.
  > Read, write, validate and merge option values as simple as possible.

[![npm Package Version](https://img.shields.io/npm/v/defined-options.svg?style=flat-square)](https://www.npmjs.com/package/defined-options)
[![MIT License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://simbo.mit-license.org)
[![Travis Build Status](https://img.shields.io/travis/simbo/defined-options/master.svg?style=flat-square)](https://travis-ci.org/simbo/defined-options)

[![Dependencies Status](https://img.shields.io/david/simbo/defined-options.svg?style=flat-square)](https://david-dm.org/simbo/defined-options)
[![devDependencies Status](https://img.shields.io/david/dev/simbo/defined-options.svg?style=flat-square)](https://david-dm.org/simbo/defined-options#info=devDependencies)
[![Code Climate GPA](https://img.shields.io/codeclimate/github/simbo/defined-options.svg?style=flat-square)](https://codeclimate.com/github/simbo/defined-options)
[![Code Climate Test Coverage](https://img.shields.io/codeclimate/coverage/github/simbo/defined-options.svg?style=flat-square)](https://codeclimate.com/github/simbo/defined-options)

---

# README IN PROGRESS

<!-- MarkdownTOC depth=5 bracket=round autolink=true -->

- [API](#api)
    - [Options()](#options)
        - [.defineOption()](#defineoption)
            - [Option definition](#option-definition)
        - [.defineOptions()](#defineoptions)
        - [.removeOption()](#removeoption)
        - [.hasOption()](#hasoption)
        - [.getPlainObject()](#getplainobject)
        - [.merge()](#merge)
        - [.mergeOptionValues()](#mergeoptionvalues)
        - [.mergeOptions()](#mergeoptions)
        - [.getOptionDefinition()](#getoptiondefinition)
        - [.getOptionDefinitions()](#getoptiondefinitions)
        - [.default()](#default)
        - [.setDefaultOptionValue()](#setdefaultoptionvalue)
        - [.setDefaultOptionValues()](#setdefaultoptionvalues)
        - [.validate()](#validate)
        - [.validateOptionValue()](#validateoptionvalue)
        - [.validateOptionValues()](#validateoptionvalues)
    - [Option()](#option)
- [License](#license)

<!-- /MarkdownTOC -->



## API

See also [tests](https://github.com/simbo/gulpplug/blob/master/test/index.js)
and [examples](https://github.com/simbo/gulpplug/blob/master/example/index.js).


### Options()

See [`lib/options.js`](https://github.com/simbo/gulpplug/blob/master/lib/options.js).

Creates a new `Options` instance. Accepts an object with option definitions as
optional argument.

``` javascript
var Options = require('defined-options');

var options = new Options({
        text: {
            validate: 'string!empty',
            default: 'foo'
        },
        answer: {
            validate: 'number>0',
            default: 42
        }
    });

console.log(options); // { text: [Getter/Setter], answer: [Getter/Setter] }
console.log(options.getPlainObject()); // { text: 'foo', answer: 42 }
console.log(options.text); // foo
console.log(options.answer); // 42
```

Options' properties have getters and setters defined via their descriptors. 
This way validation and filtering is done automagically:

``` javascript
// option 'text' only accepts non-empty strings
options.text = '';
console.log(options.text); // foo
options.text = 'bar';
console.log(options.text); // bar

// option 'answer' only accepts numbers > 0
options.answer = -7;
console.log(options.number); // 42
options.answer = 5;
console.log(options.number); // 5
```


#### .defineOption()

Creates a new option property or replaces an existing one with same name.

Accepts option definition as single argument or option name as first and
option definition as second argument.

Returns current Options instance.

``` javascript
options.defineOption({name: 'text', validate: 'string'});
// or
options.defineOption('text', {validate: 'string'});
```


##### Option definition

An option definition object can have the following properties:

  - `name`  
    *required*  
    a non-empty string defining the option name

  - `validate`  
    default: `'any'`  
    defines how to validate an options value; accepts 
    [`validate-by-shorthand`](https://github.com/simbo/validate-by-shorthand)
    arguments:
      * a string defining a [shorthand string](https://github.com/simbo/validate-by-shorthand#shorthands)
      * a regular rexpression for a match test
      * a function, receiving a value to test, returning a boolean result
      * an array of shorthand strings, regular expressions and/or 
        functions; validating an option value if any of these tests returns true

  - `filter`  
    default: `function(value) {return value;}`  
    defines a filter function, receiving the validated value, returning the 
    filtered value

  - `default`  
    default: `undefined`  
    defines an option's default value

Example with all properties:

``` javascript
options.defineProperty({
    name: 'shout',
    default: 'HELLO!',
    validate: 'string!empty',
    filter: function(value) {
        return value.toLowerCase();
    }
});

console.log(options.shout); // HELLO!
options.shout = 'bye!';
options.shout = 1;
console.log(options.shout); // BYE!
```


#### .defineOptions()

Creates new option properties or replaces existing ones with same name using 
[`defineOption()`](#defineoption).

Expects and object with option names as keys and option definitions as values.

Returns current Options instance.

``` javascript
options.defineOptions({
    name: {
        validate: 'string'
    },
    age: {
        validate: 'number>0'
    }
});
```


#### .removeOption()

Removes an option. Expects and option name. Returns current Options instance.

``` javascript
options.removeOption('foo');
```


#### .hasOption()

Tests is a option is defined. Expects an option name. Returns a boolean result.

``` javascript
options.hasOption('foo');
```


#### .getPlainObject()

Returns a plain object with option name as keys and option values as values, 
without described getters and setters.

``` javascript
console.log(options); // { text: [Getter/Setter], answer: [Getter/Setter] }
console.log(options.getPlainObject()); // { text: 'foo', answer: 42 }
```


#### .merge()

Alias for [`mergeOptionValues()`](#optionsprototypemergeoptionvalues).


#### .mergeOptionValues()

Merges an new values into current Options instance and updates an option values 
if given value is valid.

Expects on or more objects containing option names as keys and option values as 
values.

Returns current Options instance.

``` javascript
var options = new Options({
        text: {
            validate: 'string!empty',
            default: 'foo'
        },
        answer: {
            validate: 'number>0',
            default: 42
        }
    });

console.log(options.getPlainObject()); // { text: 'foo', answer: 42 }

options.merge({
    text: bar,
    answer: -7,
    name: 'Han'
});

console.log(options.getPlainObject()); // { text: 'bar', answer: 42 }
```


#### .mergeOptions()

Merges one Options instance into another. Replaces options with same name.

Expects one or more Options instances.

Returns current Options instance.

``` javascript
console.log(options.getPlainObject()); // { text: 'foo', answer: 42 }

options.mergeOptions(new Options({
    name: {
        validate: 'string',
        default: 'Han'
    }
}));

console.log(options.getPlainObject()); // { text: 'foo', answer: 42, name: 'Han' }
```

#### .getOptionDefinition()

Returns an option definition as [Option](#option) instance. Expects an 
option name.

``` javascript
```


#### .getOptionDefinitions()

Returns all option definitions as an object with option names as keys and the
respective Option instance as values.

``` javascript
```


#### .default()

``` javascript
```


#### .setDefaultOptionValue()

``` javascript
```


#### .setDefaultOptionValues()

``` javascript
```


#### .validate()

``` javascript
```


#### .validateOptionValue()

``` javascript
```


#### .validateOptionValues()

``` javascript
```


### Option()

``` javascript
```


## License

[MIT &copy; 2015 Simon Lepel](http://simbo.mit-license.org/)
