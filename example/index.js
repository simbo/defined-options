'use strict';

var Options = require('..');

var options = new Options({
        text: {
            validate: 'string!empty',
            default: 'foo',
        },
        answer: {
            validate: 'number>0',
            default: 42
        }
    });

console.log(options); // { text: [Getter/Setter], answer: [Getter/Setter] }
console.log(options.getPlainObject()); // { text: 'foo', answer: 42 }
console.log(options.text); // foo
console.log(options.number); // 0

options.text = '';
console.log(options.text); // foo
options.text = 'bar';
console.log(options.text); // bar

options.answer = false;
console.log(options.number); // 42
options.answer = 5;
console.log(options.number); // 5

options.defineOption('color', {
    default: 'red',
    validate: function(value) {
        return typeof value === 'string' &&
            ['red', 'green', 'blue'].indexOf(value.toLowerCase()) !== -1;
    },
    filter: function(value) {
        return value.toLowerCase();
    }
});

options.color = 'GREEN';

console.log(options.color); // green

options.color = 'yellow';

console.log(options.color); // green

options.mergeOptionValues({
    color: 'blue',
    text: 'Hello!'
});

console.log(options.getPlainObject()); // { text: 'Hello!', answer: 5, color: 'blue' }

var test = options.validateOptionValues({
    color: 'red',
    text: 5
});

console.log(test); // false

options.mergeOptionValues({
    color: 'red',
    text: 5
});

console.log(options.getPlainObject()); // { text: 'Hello!', answer: 5, color: 'red' }

options.defineOption('something');

console.log(options.getPlainObject()); // { text: 'Hello!', answer: 5, color: 'red', something: undefined }

console.log(options.getOptionDefinition('something').validate); // any

console.log(options.validateOptionValue('something')) // true

options.defineOption('something', {
    validate: 'number'
});

console.log(options.validateOptionValues()) // false
console.log(options.validateOptionValue('something')) // false

options.something = 5;

console.log(options.something) // 5
console.log(options.validateOptionValues()) // true
console.log(options.validateOptionValue('something')) // true


options.defineOption({
    name: 'counter',
    filter: function() {
        return (this.value || 0) + 1;
    }
});

console.log(options.counter); // 1

options.counter++;

console.log(options.counter); // 2

options.counter = 'tick!';

console.log(options.counter); // 3

options.counter--;

console.log(options.counter); // 4
