'use strict';

var typeFixtures = [
        ['array', [], true],
        ['boolean', true, 5],
        ['null', null, true],
        ['nullorundefined', null, true],
        ['nullorundefined', undefined, true],
        ['number', 5, true],
        ['string', 'foo', true],
        ['symbol', Symbol('foo'), true],
        ['undefined', undefined, true],
        ['regexp', /a/i, true],
        ['object', {}, true],
        ['date', new Date(), true],
        ['error', new Error(), true],
        ['function', function() {}, true],
        ['primitive', 5, {}],
        ['buffer', new Buffer('foo'), true],
    ],

    fixtures = {

        typeFixtures: typeFixtures,

        typeFixturesExtended: typeFixtures.filter(function(type) {
            return ['any', 'null', 'undefined', 'nullorundefined'].indexOf(type[0]) === -1;
        }),

        allTypeTests: [
            'any',
            'string!empty',
            'array!empty',
            'object!empty',
            'number>0',
            'number>=0',
            'number<0',
            'number<=0',
            'integer',
            'float',
            'array',
            'boolean',
            'null',
            'nullorundefined',
            'number',
            'string',
            'symbol',
            'undefined',
            'regexp',
            'object',
            'date',
            'error',
            'function',
            'primitive',
            'buffer',
            'array[]',
            'array{}',
            'boolean[]',
            'boolean{}',
            'number[]',
            'number{}',
            'string[]',
            'string{}',
            'symbol[]',
            'symbol{}',
            'regexp[]',
            'regexp{}',
            'object[]',
            'object{}',
            'date[]',
            'date{}',
            'error[]',
            'error{}',
            'function[]',
            'function{}',
            'primitive[]',
            'primitive{}',
            'buffer[]',
            'buffer{}',
            'string!empty[]',
            'string!empty{}',
            'array!empty[]',
            'array!empty{}',
            'object!empty[]',
            'object!empty{}',
            'number>0[]',
            'number>0{}',
            'number>=0[]',
            'number>=0{}',
            'number<0[]',
            'number<0{}',
            'number<=0[]',
            'number<=0{}',
            'integer[]',
            'integer{}',
            'float[]',
            'float{}'
        ],

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
