const fs = require('fs');
const path = require('path');

function getCustomRuleConfigFromOptions(options) {
    if (typeof options === 'string') {
        const customPath = path.resolve(process.cwd(), options);
        if (fs.existsSync(customPath)) {
            return JSON.parse(fs.readFileSync(customPath), 'utf8');
        }
    } else if (typeof options === 'object') {
        return options;
    }
    return;
}

/**
 * Get the custom rule config if any.
 *
 * @param {object} context The ESLint context
 * @returns {object|null} The resolved custom rule config or null if none exists.
 */
exports.getCustomRuleConfig = function getCustomRuleConfig(context) {
    if (!context.options || context.options.length === 0) {
        // no custom configuration path was given
        return null;
    }

    const customConfig = getCustomRuleConfigFromOptions(context.options[0]);

    // massage allowedTerms for backwards compat
    const allowedTerms = (customConfig.allowedTerms || []).map(
        (allowedTerm) => {
            switch (typeof allowedTerm) {
                case 'string': {
                    // if it's a string, the correct default for backwards compat is to only match whole words
                    // so `allowPartialMatches` must default to false
                    return { term: allowedTerm, allowPartialMatch: false };
                }
                case 'object': {
                    // if it's already an object, just return it
                    return allowedTerm;
                }
                default: {
                    throw new Error(
                        `'allowedTerms' must be an array of strings or objects. Received '${typeof allowedTerm}'`
                    );
                }
            }
        }
    );

    return {
        // give everything safe defaults
        words: customConfig.words || [],
        allowedTerms: allowedTerms
    };
};

/**
 * Merge the default and custom configuration.
 *
 * @param {object} defaultConfig The default configuration
 * @param {object} customConfig The custom configuration to merge into the default
 */
exports.mergeRuleConfigs = function mergeRuleConfigs(
    defaultConfig,
    customConfig
) {
    return {
        words: [...defaultConfig.words, ...customConfig.words],
        allowedTerms: [
            ...defaultConfig.allowedTerms,
            ...customConfig.allowedTerms
        ]
    };
};
