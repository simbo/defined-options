defined-options
========

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


## API

See also [tests](https://github.com/simbo/gulpplug/blob/master/test/index.js)
and [examples](https://github.com/simbo/gulpplug/blob/master/example/index.js).


### `Options()`

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


#### `Options.prototype.defineOption()`

Creates a new option property or replaces an existing one with same name.
Accepts option definition as single argument or option name as first and
option definition as second argument.

``` javascript
options.defineOption({name: 'text', validate: 'string'});
// or
options.defineOption('text', {validate: 'string'});
```

An option definition object can have the following properties:

  - `name`  
    *required*  
    a non-empty string defining the option name

  - `validate`  
    default: `'any'`  
    defines how to validate an options value
      * a string defining a typetest shorthand
      * a regular rexpression for a match test
      * a function, receiving a value to test, returning a boolean result
      * an array of typetest shorthand strings, regular expressions and/or 
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


#### `Options.prototype.defineOptions()`




#### `Options.prototype.removeOption()`




#### `Options.prototype.hasOption()`




#### `Options.prototype.getPlainObject()`




#### `Options.prototype.mergeOptionValues()`




#### `Options.prototype.mergeOptions()`




#### `Options.prototype.getOptionDefinition()`




#### `Options.prototype.getOptionDefinitions()`




#### `Options.prototype.setDefaultOptionValue()`




#### `Options.prototype.setDefaultOptionValues()`




#### `Options.prototype.validateOptionValue()`




#### `Options.prototype.validateOptionValues()`







## License

[MIT &copy; 2015 Simon Lepel](http://simbo.mit-license.org/)
