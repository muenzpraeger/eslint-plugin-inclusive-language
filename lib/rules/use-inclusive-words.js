'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_MESSAGE =
    "The usage of the non-inclusive word '{{word}}' is discouraged, use '{{suggestion}}' instead.";
const RULE_CATEGORY = 'Language';
const RULE_DESCRIPTION = 'highlights where non-inclusive language is used';
// eslint-disable-next-line no-unused-vars
const SUGGESTION_MESSAGE = "Replace word '{{word}}'' with '{{suggestion}}.'"; // Currently not in use

let ruleConfig = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../config/inclusive-words.json')),
    'utf8'
);

function customRuleConfig(filePath) {
    const customPath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(customPath)) {
        return JSON.parse(fs.readFileSync(customPath), 'utf8');
    }
    return;
}

function validateIfInclusive(context, node, value) {
    if (typeof value !== 'string') return;

    let regex;
    const result = ruleConfig.words.filter((wordDeclaration) => {
        // match whole words and partial words, at the end and beginning of sentences
        regex = new RegExp(`\\S*${wordDeclaration.word}\\S*`, 'ig');

        const matches = value.match(regex);
        if (matches) {
            return matches.filter(
                (word) => !ruleConfig.allowedTerms.includes(word.toLowerCase())
            ).length;
        }
        return null;
    });

    if (!result || result.length == 0) return;

    const data = {
        word: result[0].word,
        suggestion: result[0].suggestion
    };

    const reportObject = {
        node,
        message: result[0].explanation
            ? result[0].explanation
            : DEFAULT_MESSAGE,
        data
        // TODO: For now I am sticking with not providing autocorrect-suggestions, as there can be many variations
        // of how and where a word can show up.
        // suggest: result[0].suggestion
        //     ? [
        //           {
        //               message: SUGGESTION_MESSAGE,
        //               data,
        //               fix: function (fixer) {
        //                   return fixer.replaceText(node, value.replace(regex, result[0].suggestion));
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
        type: 'suggestion'
    },
    create: function (context) {
        if (context.options && context.options.length > 0) {
            const customConfig = customRuleConfig(context.options[0]);
            if (customConfig !== undefined) {
                ruleConfig = {
                    words: [...ruleConfig.words, ...(customConfig.words || [])],
                    allowedTerms: [
                        ...ruleConfig.allowedTerms,
                        ...(customConfig.allowedTerms || [])
                    ]
                };
            }
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
