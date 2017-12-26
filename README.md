# Steemsnippets

This is a collection of various snippets for steem.

This is intended to be a collection where people can come, search for a specific functionality and have a working code snippet associated.

If you try a snippet and it ends up not working/is outdated, please open an issue or a pull request :)

Don't hesitate to submit a pull request if you want to contribute to the collection.

Made by @Howo : https://utopian.io/@howo


# Current snippets :

## Steemjs

- How to use the @almost-digital's testnet : https://testnet.steem.vc/
- How to create an account
- How to test if an username/password or username/privatekey is correct

## How to contribute

I obviously accept external pull requests. Look up github's documentation on [How to create a pull request](https://help.github.com/articles/creating-a-pull-request/) on how to do so. But make sure you follow these rules :

* The function must be small and must only do one action (post an article, broadcast a vote etc).
* The function must be fully commented jsdoc/python docstring style
* The files must follow the directory structure :
  * /library/nameofthesnippet/nameofhtesnippet.js/.py
* The file must include an installation file with all the dependencies. Aka a requirements.txt for python or a package.json for nodejs. This must be placed next to the source code file.
