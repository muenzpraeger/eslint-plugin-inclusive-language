# Migrating from 1.2.x to 2.0.0

Starting with release 2.0.0 multiple word replacement options are now possible. If you just use the standard configuration this won't have an effect.

If you maintain a custom configuration you will have to update the keyword `suggestion` to the plural form `suggestions`. The value type needs to switch from an array to a string of arrays.

Before 2.0.0:

```json
{
    "word": "guys",
    "suggestion": "people", // This line
    "explanation": "The usage of the non-inclusive word '{{word}}' is discouraged, use '{{suggestion}}' instead."
}
```

Starting with 2.0.0:

```json
{
    "word": "guys",
    "suggestions": ["people"], // This line
    "explanation": "The usage of the non-inclusive word '{{word}}' is discouraged, use '{{suggestion}}' instead."
}
```
