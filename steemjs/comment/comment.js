var steem = require('steem');

/**
 * Creates an account, note that almost no validation is done.
 * @param {String} username - username of the account
 * @param {String} password - password of the account
 * @param {String} author - Author of the post to comment to
 * @param {String} permlink - permanent link of the post to comment to. eg : https://steemit.com/programming/@howo/introducting-steemsnippets the permlink is "introducting-steemsnippets"
 * @param {String} text - Content of the comment.
 * @param {object} [jsonMetadata] - dictionnary with additional tags, app name, etc,
 */
function comment(username, password, author,  permlink, text, jsonMetadata) {
    var wif = steem.auth.toWif(username, password, 'posting');
    jsonMetadata = jsonMetadata || {};
    var comment_permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();

    steem.broadcast.comment(wif, author, permlink, username, comment_permlink , '', text, jsonMetadata, function(err, result) {
        console.log(err, result);
    });
}

// example
comment("username", "password", "howo", "introducting-steemsnippets", 'Woah nice article');

