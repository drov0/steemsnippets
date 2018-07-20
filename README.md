# Steemsnippets

This is a collection of various snippets for steem.

This is intended to be a collection where people can come, search for a specific functionality and have a working code snippet associated.

If you try a snippet and it ends up not working/is outdated, please open an issue or a pull request :)

Don't hesitate to submit a pull request if you want to contribute to the collection.

Made by @howo : https://steemit.com/@howo


# Current snippets :

## [Steem-js](https://github.com/steemit/steem-js)

Active snippets (add things to the blockchain)
- [How to use @almost-digital's testnet](https://github.com/drov0/steemsnippets/tree/master/steemjs/use_testnet) https://testnet.steem.vc/
- [How to create an account](https://github.com/drov0/steemsnippets/tree/master/steemjs/create_account)
- [How to post an article](https://github.com/drov0/steemsnippets/tree/master/steemjs/post)
- [How to comment on an article](https://github.com/drov0/steemsnippets/tree/master/steemjs/comment)
- [How to cast a vote/flag](https://github.com/drov0/steemsnippets/tree/master/steemjs/vote)
- [How to transfer steem/sbd](https://github.com/drov0/steemsnippets/tree/master/steemjs/transfer)
- [How to resteem a post](https://github.com/drov0/steemsnippets/tree/master/steemjs/resteem)

Passive snippets (read from the blockchain) :
- [How to test if an username/password or username/privatekey is correct](https://github.com/drov0/steemsnippets/tree/master/steemjs/test_login)
- [How to get recent posts](https://github.com/drov0/steemsnippets/tree/master/steemjs/get_new_posts)
- [How to get active votes of an user](https://github.com/drov0/steemsnippets/tree/master/steemjs/get_active_votes)
- [How to get the steem power of an user](https://github.com/drov0/steemsnippets/tree/master/steemjs/get_steem_power)
- [How to get the number of followers and follows of an user](https://github.com/drov0/steemsnippets/tree/master/steemjs/get_followers_following)
- [How to test if a post exists or not](https://github.com/drov0/steemsnippets/tree/master/steemjs/post_exists)
- [How to get the voting power of an user ](https://github.com/drov0/steemsnippets/tree/master/steemjs/voting_power)
- [Convert simplified reputation to an approximate raw score](https://github.com/drov0/steemsnippets/tree/master/steemjs/simplified_rep_to_raw)
- [How to get the main post author and permlink from a comment](https://github.com/drov0/steemsnippets/tree/master/steemjs/get_root_post)
- [How to get the simplified and raw reputation of an user](https://github.com/drov0/steemsnippets/tree/master/steemjs/get_reputation)

## [Dsteem](https://github.com/jnordberg/dsteem)

- [How to post an article](https://github.com/drov0/steemsnippets/tree/master/dsteem/post)
- [How to comment on an article](https://github.com/drov0/steemsnippets/tree/master/dsteem/comment)
- [How to cast a vote/flag](https://github.com/drov0/steemsnippets/tree/master/dsteem/vote)
- [block stream skeleton to easily act on various operations as they go live on the blockchain](https://github.com/drov0/steemsnippets/tree/master/dsteem/block_feed)

## [steem-python](https://github.com/steemit/steem-python)

- [How to post an article](https://github.com/drov0/steemsnippets/tree/master/steem-python/post)
- [How to cast a vote/flag](https://github.com/drov0/steemsnippets/tree/master/steem-python/vote)



# How to contribute

I obviously accept external pull requests. Look up github's documentation on [How to create a pull request](https://help.github.com/articles/creating-a-pull-request/) on how to do so. But make sure you follow these rules :

* The function must be small and must only do one action (post an article, broadcast a vote etc).
* The function must be fully commented jsdoc/python docstring style
* The files must follow the directory structure :
  * /library/nameofthesnippet/nameofhtesnippet.js/.py
* The file must include an installation file with all the dependencies. Aka a requirements.txt for python or a package.json for nodejs. This must be placed next to the source code file.
