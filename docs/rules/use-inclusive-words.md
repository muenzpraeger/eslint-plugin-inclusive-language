# Enforce the usage of inclusive words (use-inclusive-words)

## Rule Details

This rule aims to raise awareness of non-inclusive words.

### Options

This rule has an optional parameter. The value of this parameter can be either a configuration object, or a path to a custom JSON file, relative to your projects root directory, where you can provide custom words that you want to check.

Example of using the [default words](http://github.com/muenzpraeger/eslint-plugin-inclusive-language/tree/primary/lib/config/inclusive-words.json):

```json
{
    "plugins": ["inclusive-language"],
    "rules": {
        "inclusive-language/use-inclusive-words": ["error"]
    }
}
```

Example of using a custom words file:

```json
{
    "plugins": ["inclusive-language"],
    "rules": {
        "inclusive-language/use-inclusive-words": [
            "error",
            "./config/my-inclusive-words.json"
        ]
    }
}
```

Example of using an inline configuration:

```json
{
    "plugins": ["inclusive-language"],
    "rules": {
        "inclusive-language/use-inclusive-words": [
            "error",
            {
                "words": [
                    {
                        "word": "guys",
                        "suggestion": "people",
                        "explanation": "The usage of the non-inclusive word '{{word}}' is discouraged, use '{{suggestion}}' instead."
                    }
                ]
            }
        ]
    }
}
```

This is an example for a custom configuration. The `explanation` key is optional. If not present the default message will be used. If you want to include at runtime the `word` or `suggestion` in your explanation, put them between double curly braces.

```json
{
    "words": [
        {
            "word": "guys",
            "suggestion": "people",
            "explanation": "The usage of the non-inclusive word '{{word}}' is discouraged, use '{{suggestion}}' instead."
        }
    ]
}
```

You may also specify a list of explicitly allowed term objects in the configuration using the `allowedTerms` key. The `term` key should be the full word of the allowed term (not a part of a word) and should be all lowercase. Using the `allowPartialMatches` key you define if you want to allow partial matches of the term.

```json
{
    "allowedTerms": [{ "term": "mastercard", "allowPartialMatches": true }]
}
```

This will allow all of the following to pass without warning or error:

-   `mastercard`
-   `MasterCard`
-   `masterCard`
-   `masterCardVerification`
-   `"The card type is MasterCard"`

With setting `allowPartialMatches` to `false` it will fail on the following due to it not being the full word.

-   `masterCardVerification`

## When not to use it

If you don't want to check for inclusive language in your codebase.
