'use strict';

const rule = require('../../../lib/rules/use-inclusive-words');

const customConfigAutofix = {
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
    autofix: true,
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
            options: [customConfigAutofix]
        },
        {
            code: 'var ccType = "MasterFoo"',
            options: [customConfigAutofix]
        },
        {
            code: 'var fooMaster = 1',
            options: [customConfigAutofix]
        },
        {
            code: 'var BazMasterBar = function () {}',
            options: [customConfigAutofix]
        },
        {
            code:
                '/* This is an example of non-partial matching (not-partial-guys) */',
            options: [customConfigAutofix]
        },
        {
            code:
                '/* This is an example of partial matching (extra-definitiely-partial-guys) */',
            options: [customConfigAutofix]
        },
        {
            code:
                '// A comment with a a url https://myvcs.com/someAccount/blob/master/README.md',
            options: [customConfigAutofix]
        },
        {
            code: 'var something_notslugpartialguys = 323',
            options: [customConfigAutofix]
        }
    ],
    invalid: [
        {
            code: 'var isBlacklisted = true',
            options: [customConfigAutofix],
            errors: [
                {
                    message:
                        "To convey the same idea, consider 'blocklist' instead of 'blacklist'."
                }
            ],
            output: 'var isBlocklisted = true'
        },
        {
            code: 'function rulesUpdate(whitelist) {}',
            options: [customConfigAutofix],
            errors: [
                {
                    message:
                        "To convey the same idea, consider 'allowlist' instead of 'whitelist'."
                }
            ],
            output: 'function rulesUpdate(allowlist) {}'
        },
        {
            code: '// This updates the master branch of the repository.',
            options: [customConfigAutofix],
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                }
            ],
            output: '// This updates the primary branch of the repository.'
        },
        {
            code:
                'var sendUpdate = isMasterConnected ? true : isSlaveConnected',
            options: [customConfigAutofix],
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                },
                {
                    message:
                        "Instead of 'slave', you really should consider an alternative like 'secondary'."
                }
            ],
            output:
                'var sendUpdate = isPrimaryConnected ? true : isSecondaryConnected'
        },
        {
            code: 'var message = "This is a group of guys."',
            options: [customConfigAutofix],
            errors: [
                {
                    message: "Instead of 'guys', you can use 'people'."
                }
            ],
            output: 'var message = "This is a group of people."'
        },
        {
            code: 'var fooMasters = 1',
            options: [customConfigAutofix],
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                }
            ],
            output: 'var fooPrimarys = 1'
        },
        {
            code: 'var message = "made-it-partial-not-partial-guys"',
            options: [customConfigAutofix],
            errors: [
                {
                    message: "Instead of 'guys', you can use 'people'."
                }
            ],
            output: 'var message = "made-it-partial-not-partial-people"'
        },
        {
            code: 'var classname = "master-bar"',
            options: [customConfigAutofix],
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
            output: 'var classname = "primary-bar"'
        },
        {
            code: '<MasterClass />',
            options: [customConfigAutofix],
            errors: [
                {
                    message: "Instead of 'master', you can use 'primary'."
                }
            ],
            output: '<PrimaryClass />'
        },
        {
            code: '<Foo blacklist={blacklist} />',
            options: [customConfigAutofix],
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
            output: '<Foo blocklist={blocklist} />'
        }
    ]
});
