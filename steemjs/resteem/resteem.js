var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});
/**
 * Casts a vote.
 * @param {String} username - username of the account resteeming
 * @param {String} postingkey - posting key of the account resteeming
 * @param {String} author - Author of the post to resteem
 * @param {String} permlink - permanent link of the post to resteem to. eg : https://steemit.com/programming/@howo/introducting-steemsnippets the permlink is "introducting-steemsnippets"
 */
function resteem(username, postingkey, author, permlink)
{
    const json = JSON.stringify(['reblog', {
        account: username,
        author: author,
        permlink: permlink
    }]);

    steem.broadcast.customJson(postingkey, [], [username], 'follow', json,function (err, result) {
        console.log(err, result);
    });
}

// example : resteem this post https://steemit.com/programming/@howo/introducting-steemsnippets
resteem("username", "private posting key", "howo", "introducting-steemsnippets");