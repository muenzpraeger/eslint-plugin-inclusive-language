'use strict';

const rule = require('../../../lib/rules/use-inclusive-words');

const customConfigDefault = {
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
    ],
    lintStrings: true
};

const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    }
});

ruleTester.run('use-inclusive-words', rule, {
    valid: [
        {
            code: 'var whoWeAre = "We are allies."'
        },
        {
            code: 'var message = "This is a group of people."',
            options: [customConfigDefault]
        },
        {
            code: 'var ccType = "MasterFoo"',
            options: [customConfigDefault]
        },
        {
            code: 'var fooMaster = 1',
            options: [customConfigDefault]
        },
        {
            code: 'var BazMasterBar = function () {}',
            options: [customConfigDefault]
        },
        {
            code: '/* This is an example of non-partial matching (not-partial-guys) */',
            options: [customConfigDefault]
        },
        {
            code: '/* This is an example of partial matching (extra-definitiely-partial-guys) */',
            options: [customConfigDefault]
        },
        {
            code: '// A comment with a a url https://myvcs.com/someAccount/blob/master/README.md',
            options: [customConfigDefault]
        },
        {
            code: 'var something_notslugpartialguys = 323',
            options: [customConfigDefault]
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
            ],
            output: 'var isBlacklisted = true'
        },
        {
            code: 'function rulesUpdate(whitelist) {}',
            errors: [
                {
                    message:
                        "To convey the same idea, consider 'allowlist' instead of 'whitelist'."
                }
            ],
            output: 'function rulesUpdate(whitelist) {}'
        },
        {
            code: '// This updates the master branch of the repository.',
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                }
            ],
            output: '// This updates the master branch of the repository.'
        },
        {
            code: 'var sendUpdate = isMasterConnected ? true : isSlaveConnected',
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                },
                {
                    message:
                        "Instead of 'slave', you really should consider an alternative like 'secondary'."
                }
            ],
            output: 'var sendUpdate = isMasterConnected ? true : isSlaveConnected'
        },
        {
            code: 'var message = "This is a group of guys."',
            options: [customConfigDefault],
            errors: [
                {
                    message: "Instead of 'guys', you can use 'people'."
                }
            ],
            output: 'var message = "This is a group of guys."'
        },
        {
            code: 'var fooMasters = 1',
            options: [customConfigDefault],
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                }
            ],
            output: 'var fooMasters = 1'
        },
        {
            code: 'var message = "made-it-partial-not-partial-guys"',
            options: [customConfigDefault],
            errors: [
                {
                    message: "Instead of 'guys', you can use 'people'."
                }
            ],
            output: 'var message = "made-it-partial-not-partial-guys"'
        },
        {
            code: 'var classname = "master-bar"',
            options: [customConfigDefault],
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'.",
                    suggestions: [
                        {
                            desc: "Replace word 'master' with 'primary.'"
                        },
                        {
                            desc: "Replace word 'master' with 'main.'"
                        }
                    ]
                }
            ],
            output: 'var classname = "master-bar"'
        },
        {
            code: '<MasterClass />',
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                }
            ],
            output: '<MasterClass />'
        },
        {
            code: '<Foo blacklist={blacklist} />',
            errors: [
                {
                    message:
                        "To convey the same idea, consider 'blocklist' instead of 'blacklist'."
                },
                {
                    message:
                        "To convey the same idea, consider 'blocklist' instead of 'blacklist'."
                }
            ],
            output: '<Foo blacklist={blacklist} />'
        }
    ]
});
