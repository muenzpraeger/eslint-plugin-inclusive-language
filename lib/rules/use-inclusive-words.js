'use strict';

const fs = require('fs');
const path = require('path');
const {
    getCustomRuleConfig,
    mergeRuleConfigs
} = require('../utils/custom-rule-config');

const DEFAULT_MESSAGE =
    "The usage of the non-inclusive word '{{word}}' is discouraged, use '{{suggestions}}' instead.";
const RULE_CATEGORY = 'Language';
const RULE_DESCRIPTION = 'highlights where non-inclusive language is used';
// eslint-disable-next-line no-unused-vars
const SUGGESTION_MESSAGE = "Replace word '{{word}}'' with '{{suggestions}}.'"; // Currently not in use

let ruleConfig = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../config/inclusive-words.json')),
    'utf8'
);

/**
 * Remove allowed terms from the list of words, checking
 * for partial or complete matches based on each allowed
 * term's configuration.
 *
 * @param {string[]} words The list of words to filter
 * @returns {string[]} The list of words excluding any allowed terms
 */
function excludeAllowedTerms(words) {
    return words.filter((word) => {
        const isAllowedTerm = ruleConfig.allowedTerms.find(
            ({ term, allowPartialMatches }) => {
                if (!allowPartialMatches) {
                    return word.toLowerCase() === term;
                }
                return word.toLowerCase().includes(term);
            }
        );

        return !isAllowedTerm;
    });
}

function validateIfInclusive(context, node, value) {
    if (typeof value !== 'string') return;

    let regex;
    const result = ruleConfig.words.filter((wordDeclaration) => {
        // match whole words and partial words, at the end and beginning of sentences
        regex = new RegExp(`[\\w-_/]*${wordDeclaration.word}[\\w-_/]*`, 'ig');

        const matches = value.match(regex);
        if (matches) {
            return excludeAllowedTerms(matches).length;
        }
        return null;
    });

    if (!result || result.length == 0) return;

    const data = {
        word: result[0].word,
        suggestions: result[0].suggestions.join(', ')
    };

    const reportObject = {
        node,
        message: result[0].explanation
            ? result[0].explanation
            : DEFAULT_MESSAGE,
        data
        // TODO: For now I am sticking with not providing autocorrect-suggestions, as there can be many variations
        // of how and where a word can show up.
        // suggest: result[0].suggestions.join(', ')
        //     ? [
        //           {
        //               message: SUGGESTION_MESSAGE,
        //               data,
        //               fix: function (fixer) {
        //                   return fixer.replaceText(node, value.replace(regex, result[0].suggestions.join(', ')));
        //               }
        //           }
        //       ]
        //     : undefined
    };
    context.report(reportObject);
}

module.exports = {
    meta: {
        docs: {
            description: RULE_DESCRIPTION,
            category: RULE_CATEGORY,
            recommended: true,
            url:
                'http://github.com/muenzpraeger/eslint-plugin-inclusive-language/tree/primary/docs/rules/use-inclusive-words.md'
        },
        schema: [
            {
                customFile: 'string'
            }
        ],
        type: 'suggestions'
    },
    create: function (context) {
        const customConfig = getCustomRuleConfig(context);

        if (customConfig) {
            ruleConfig = mergeRuleConfigs(ruleConfig, customConfig);
        }

        return {
            Literal(node) {
                validateIfInclusive(context, node, node.value);
            },
            Identifier(node) {
                validateIfInclusive(context, node, node.name);
            },
            TemplateElement(node) {
                validateIfInclusive(context, node, node.value.raw);
            },
            Program(node) {
                node.comments
                    .filter((c) => c.type !== 'Shebang')
                    .forEach((c) => {
                        validateIfInclusive(context, c, c.value);
                    });
            }
        };
    }
};
