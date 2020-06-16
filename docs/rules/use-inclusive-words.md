# Enforce the usage of inclusive words (use-inclusive-words)

## Rule Details

This rule aims to raise awareness of non-inclusive words.

### Options

This rule has an optional string parameter. The value of this parameter should be a path to a custom JSON file, relative to your projects root directory, where you can provide custom words that you want to check.

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

This is an example for a custom words file. The `explanation` key is optional. If not present the default message will be used. If you want to include at runtime the `word` or `suggestion` in your explanation, put them between double curly braces.

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

## When not to use it

If you don't want to check for inclusive language in your codebase.
