'use strict';

const path = require('path');

const rule = require('../../../lib/rules/use-inclusive-words');
const customConfig = path.resolve(
    process.cwd(),
    './tests/lib/config/inclusive-words.json'
);

const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

console.log(customConfig);

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
        }
    ]
});
