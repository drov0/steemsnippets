var steem = require('steem');

/**
 * Casts a vote.
 * @param {String} username - username of the voter account
 * @param {String} password - password of the voter account
 * @param {String} author - Author of the post
 * @param {String} permlink - permanent link of the post to comment to. eg : https://steemit.com/programming/@howo/introducting-steemsnippets the permlink is "introducting-steemsnippets"
 * @param {int} weight - Power of the vote, can range from -10000 to 10000, 10000 equals a 100% upvote. -10000 equals a 100% flag.
 */
function vote(username, password, author, permlink, weight)
{
    var wif = steem.auth.toWif(username, password, 'posting');
    steem.broadcast.vote(wif, username, author, permlink, weight, function(err, result) {
        console.log(err, result);
    });
}

// example : give a 100% upvote to the post https://steemit.com/programming/@howo/introducting-steemsnippets
vote("username", "password", "howo", "introducting-steemsnippets", 10000);