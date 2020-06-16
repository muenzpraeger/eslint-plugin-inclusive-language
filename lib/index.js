'use strict';

const rules = {
    'use-inclusive-words': require('./rules/use-inclusive-words')
};

module.exports = {
    configs: {
        all: {
            plugins: ['inclusive-language'],
            rules: {
                'inclusive-language/use-inclusive-words': 'error'
            }
        }
    },
    rules
};
