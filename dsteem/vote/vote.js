var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');

/**
 * Creates an account, note that almost no validation is done.
 * @param {String} username - username of the voter account
 * @param {String} password - password of the voter account
 * @param {String} author - Author of the post
 * @param {String} url - permlink of the post eg :
 * @param {String} permlink - permanent link of the post to comment to. eg : https://steemit.com/programming/@howo/introducting-steemsnippets the permlink is "introducting-steemsnippets"
 * @param {int} weight - Power of the vote, can range from -10000 to 10000, 10000 equals a 100% upvote. -10000 equals a 100% flag.
 */
function vote(username, password, author, permlink, weight)
{
    var wif = dsteem.PrivateKey.fromLogin(username, password, 'posting')

    client.broadcast.vote({
        voter: username,
        author: author,
        permlink: permlink,
        weight: weight
    }, wif).then(function(result){
        console.log('Included in block: ' + result.block_num)
    }, function(error) {
        console.error(error)
    });

}

// example : give a 100% upvote to the post https://steemit.com/programming/@howo/introducting-steemsnippets
vote("username", "password", "howo", "introducting-steemsnippets", 10000);