'use strict';

const rule = require('../../../lib/rules/use-inclusive-words');

const customConfig = {
    words: [
        {
            word: 'guys',
            suggestion: 'people',
            explanation: "Instead of '{{word}}', you can use '{{suggestion}}'."
        }
    ],
    allowedTerms: [
        'masterfoo',
        'foomaster',
        'bazmasterbar',
        { term: 'blob/master', allowPartialMatches: true },
        { term: 'definitiely-partial-guys', allowPartialMatches: true },
        { term: 'not-partial-guys', allowPartialMatches: false },
        { term: 'notslugpartialguys', allowPartialMatches: true }
    ]
};

const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('use-inclusive-words', rule, {
    valid: [
        {
            code: 'var whoWeAre = "We are allies."'
        },
        {
            code: 'var message = "This is a group of people."',
            options: [customConfig]
        },
        {
            code: 'var ccType = "MasterFoo"',
            options: [customConfig]
        },
        {
            code: 'var fooMaster = 1',
            options: [customConfig]
        },
        {
            code: 'var BazMasterBar = function () {}',
            options: [customConfig]
        },
        {
            code:
                '/* This is an example of non-partial matching (not-partial-guys) */',
            options: [customConfig]
        },
        {
            code:
                '/* This is an example of partial matching (extra-definitiely-partial-guys) */',
            options: [customConfig]
        },
        {
            code:
                '// A comment with a a url https://myvcs.com/someAccount/blob/master/README.md',
            options: [customConfig]
        },
        {
            code: 'var something_notslugpartialguys = 323',
            options: [customConfig]
        }
    ],
    invalid: [
        {
            code: 'var isBlacklisted = true',
            errors: [
                {
                    message:
                        "To convey the same idea, consider 'blocklist' instead of 'blacklist'."
                }
            ]
        },
        {
            code: 'function rulesUpdate(whitelist) {}',
            errors: [
                {
                    message:
                        "To convey the same idea, consider 'allowlist' instead of 'whitelist'."
                }
            ]
        },
        {
            code: '// This updates the master branch of the repository.',
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                }
            ]
        },
        {
            code:
                'var sendUpdate = isMasterConnected ? true : isSlaveConnected',
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                },
                {
                    message:
                        "Instead of 'slave', you really should consider an alternative like 'secondary'."
                }
            ]
        },
        {
            code: 'var message = "This is a group of guys."',
            options: [customConfig],
            errors: [
                {
                    message: "Instead of 'guys', you can use 'people'."
                }
            ]
        },
        {
            code: 'var fooMasters = 1',
            options: [customConfig],
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                }
            ]
        },
        {
            code: 'var message = "made-it-partial-not-partial-guys"',
            options: [customConfig],
            errors: [
                {
                    message: "Instead of 'guys', you can use 'people'."
                }
            ]
        },
        {
            code: 'var classname = "master-bar"',
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                }
            ]
        }
    ]
});
