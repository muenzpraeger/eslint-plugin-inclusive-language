# eslint-plugin-inclusive-language

An ESLint plugin to raise awareness for using inclusive language not only in your codebase, but in life.

[![Github Workflow](https://github.com/muenzpraeger/eslint-plugin-inclusive-language/workflows/build%20primary/badge.svg?branch=primary)](https://github.com/muenzpraeger/eslint-plugin-inclusive-language/actions) [![Version](https://img.shields.io/npm/v/eslint-plugin-inclusive-language.svg)](https://npmjs.org/package/eslint-plugin-inclusive-language)

> If you're upgrading from 1.x.x. to 2.x.x, please read the [migration document here first](/docs/migration_200.md).

## What is inclusive language anyway?

This is a great question to ask.

Lets start with a general definition of "inclusive language":

> Inclusive language is language that is free from words, phrases or tones that reflect prejudiced, stereotyped or discriminatory views of particular people or groups. It is also language that doesn’t deliberately or inadvertently exclude people from being seen as part of a group. ([Source](https://publicdocumentcentre.education.tas.gov.au/Documents/Guidelines-for-Inclusive-Language.pdf))

While it sounds obvious to adhere to use language that is inclusive, it may not always be as obvious to apply as you think. Sometimes it can also be subtle, and you're just not aware. Especially when you're using language that is not your first language. I am speaking out of my own experience.

Let me give you a simple example (where I had to unlearn non-inclusive behavior myself):
How often do you use the term "hey guys" when addressing a group of people? And how often can you say with 100% certainty that all members of that group identify as male? In English lessons I learned many decades ago that it's OK to use "guys" to address any group. In reality it's not OK, and adjusting (in this case my own) language helps others to be more included in conversations.

There are many terms that we can have really looooong arguments about if they are inclusive, or non-inclusive. And there are many that are really obvious. Depending on your first language, it can be even more difficult to differentiate.

This plugin contains, for now, [four terms](http://github.com/muenzpraeger/eslint-plugin-inclusive-language/tree/primary/lib/config/inclusive-words.json), where IMHO the tech industry as a whole is coming to/came to a consensus to change (the existing) standards. It will grow, over time. If you want to see some of this for yourself, there is a discussion about these terms [here](https://tools.ietf.org/id/draft-knodel-terminology-00.html#rfc.section.1.1.1).

Now, if you ask yourself "Do I really _need_ this plugin?"... read further.

## Why would I need an ESLint plugin for that?

There may be a high likelihood you won't need it. You still may want to use it though.

First, if you read all this text, and if you haven't been aware of this topic until now, then I've reached my goal for this project. Think about it, read about it (there's plenty of information on the internet), discuss with your colleagues and friends, and hopefully apply a more inclusive language.

Second, if you want to raise awareness, using this plugin is _an_ option (eventually not _the_ only one). Just having it in your codebase, and with that eventually bringing people to this repository and text, is a step. When more people learn, more people will apply these patterns to their own language.

Third, if you want to participate, you can open issues on the [repo](http://github.com/muenzpraeger/eslint-plugin-inclusive-language/). Or customize this plugin for your own usage or language, fork the repository, whatever you prefer. I don't care really about npm installs, or stars on this particular repo. I care that you start learning about inclusive language, and how to apply it. It's still a journey for me, unlearning many different behaviours.

## Installation

Ok, you're here, so let's come to the technical part.

You'll first need to install [ESLint](https://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-inclusive-language`:

```
$ npm install eslint-plugin-inclusive-language --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-inclusive-language` globally.

## Usage

Add `inclusive-language` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["inclusive-language"]
}
```

Then configure the rule `use-inclusive-words`.

```json
{
    "rules": {
        "inclusive-language/use-inclusive-words": "error"
    }
}
```

That's it. You can find information on how to customize it in the [rule documentation](http://github.com/muenzpraeger/eslint-plugin-inclusive-language/tree/primary/docs/rules/use-inclusive-words.md).
