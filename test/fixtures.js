'use strict';

var fixtures = {

    initialOptions: {
        foo: {
            validate: 'string!empty',
            default: 'bar'
        },
        answer: {
            validate: 'number',
            default: 42
        }
    },

    initialDefinitions: {
        foo: {
            value: 'bar',
            name: 'foo',
            validate: 'string!empty',
            default: 'bar'
        },
        answer: {
            value: 42,
            name: 'answer',
            validate: 'number',
            default: 42
        }
    },

    additionalOptions: {
        foo: {
            validate: 'string',
            default: 'baz'
        },
        some: {
            default: 'thing'
        }
    }

};

module.exports = fixtures;
