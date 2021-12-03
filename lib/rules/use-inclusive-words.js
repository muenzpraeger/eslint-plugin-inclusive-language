'use strict';

const { readFileSync } = require('fs');
const { resolve } = require('path');
const { getCustomRuleConfig } = require('../utils/custom-rule-config');
const { camelize, pascalize } = require('humps');

const DEFAULT_MESSAGE =
    "The usage of the non-inclusive word '{{word}}' is discouraged, use '{{suggestion}}' instead.";
const PROJECT_URL =
    'http://github.com/muenzpraeger/eslint-plugin-inclusive-language/tree/primary/docs/rules/use-inclusive-words.md';
const RULE_CATEGORY = 'Language';
const RULE_DESCRIPTION = 'highlights where non-inclusive language is used';
const SUGGESTION_MESSAGE = "Replace word '{{word}}' with '{{suggestion}}.'";

let ruleConfig = JSON.parse(
    readFileSync(resolve(__dirname, '../config/inclusive-words.json')),
    'utf8'
);

let customConfig;
let wordDeclarationRegexMap = new Map();

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
        let isAllowedTerm;

        if (customConfig) {
            isAllowedTerm = customConfig.allowedTerms.find(
                ({ term, allowPartialMatches }) => {
                    if (!allowPartialMatches) {
                        return word.toLowerCase() === term;
                    }
                    return word.toLowerCase().includes(term);
                }
            );
        }

        return !isAllowedTerm;
    });
}

function buildFixer(context, node, regex, word, newValue) {
    return (fixer) => {
        const source = context.getSourceCode().getText(node);
        const result = replace(source, regex, word, newValue);
        return fixer.replaceText(node, result);
    };
}

function replace(source, regex, word, replacement) {
    return source.replace(regex, (fullMatch, capture) => {
        const matcher = new RegExp(word, 'i');
        if (capture.toUpperCase() === capture)
            return fullMatch.replace(matcher, replacement.toUpperCase());
        if (capture.toLowerCase() === capture)
            return fullMatch.replace(matcher, replacement.toLowerCase());
        if (capture[0].toLowerCase() == capture[0])
            return fullMatch.replace(matcher, camelize(replacement));
        return fullMatch.replace(matcher, pascalize(replacement));
    });
}

function validateIfInclusive(context, node, value) {
    if (typeof value !== 'string') return;

    let regex;
    let result;

    if (customConfig) {
        result = customConfig.words.find((wordDeclaration) => {
            // match whole words and partial words, at the end and beginning of sentences
            regex = wordDeclarationRegexMap.get(wordDeclaration.word);
            const didMatch = regex.test(value);
            if (didMatch) return excludeAllowedTerms(value.match(regex)).length;
        });
    }

    if (!result) {
        result = ruleConfig.words.find((wordDeclaration) => {
            // match whole words and partial words, at the end and beginning of sentences
            regex = wordDeclarationRegexMap.get(wordDeclaration.word);
            const didMatch = regex.test(value);
            if (didMatch) return excludeAllowedTerms(value.match(regex)).length;
        });
    }

    if (!result) return;

    const { word, explanation } = result;
    // backwards-compatibility with singular suggestions
    const suggestions = result.suggestions
        ? result.suggestions
        : [result.suggestion];

    const suggest = suggestions.map((suggestion) => {
        return {
            desc: SUGGESTION_MESSAGE,
            data: {
                word,
                suggestion
            },
            fix: buildFixer(context, node, regex, word, suggestion)
        };
    });

    const reportObject = {
        data: {
            word,
            suggestion: suggestions[0]
        },
        node,
        suggest,
        fix:
            customConfig && customConfig.autofix
                ? buildFixer(context, node, regex, word, suggestions[0])
                : undefined,
        message: explanation || DEFAULT_MESSAGE
    };

    context.report(reportObject);
}

module.exports = {
    meta: {
        docs: {
            description: RULE_DESCRIPTION,
            category: RULE_CATEGORY,
            recommended: true,
            url: PROJECT_URL
        },
        fixable: 'code',
        schema: [
            {
                customFile: 'string'
            }
        ],
        type: 'suggestion',
        hasSuggestions: true
    },
    create: function (context) {
        customConfig = getCustomRuleConfig(context);

        if (customConfig) {
            customConfig.words.forEach(({ word }) => {
                if (!wordDeclarationRegexMap.has(word)) {
                    wordDeclarationRegexMap.set(
                        word,
                        // match whole words and partial words, at the end and beginning of sentences
                        new RegExp(`[\\w-_/]*(${word})[\\w-_/]*`, 'ig')
                    );
                }
            });
        }

        ruleConfig.words.forEach(({ word }) => {
            if (!wordDeclarationRegexMap.has(word)) {
                wordDeclarationRegexMap.set(
                    word,
                    // match whole words and partial words, at the end and beginning of sentences
                    new RegExp(`[\\w-_/]*(${word})[\\w-_/]*`, 'ig')
                );
            }
        });

        return {
            Literal(node) {
                customConfig && customConfig.lintStrings
                    ? validateIfInclusive(context, node, node.value)
                    : undefined;
            },
            Identifier(node) {
                validateIfInclusive(context, node, node.name);
            },
            JSXIdentifier(node) {
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
