var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');

/**
 * Creates an account, note that almost no validation is done.
 * @param {String} username - username of the account
 * @param {String} password - password of the account
 * @param {String} author - Author of the post to comment to
 * @param {String} permlink - permanent link of the post to comment to. eg : https://steemit.com/programming/@howo/introducting-steemsnippets the permlink is "introducting-steemsnippets"
 * @param {String} text - Content of the comment.
 * @param {String} [jsonMetadata] - Json string with additional tags, app name, etc,
 */
function comment(username, password, author,  permlink, text, jsonMetadata) {
    var wif = dsteem.PrivateKey.fromLogin(username, password, 'posting')
    jsonMetadata = jsonMetadata || '';
    var comment_permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();

    client.broadcast.comment({
        author: username,
        title : '',
        body : text,
        json_metadata : jsonMetadata,
        parent_author : author ,
        parent_permlink: permlink,
        permlink : comment_permlink
    }, wif).then(function(result){
        console.log('Included in block: ' + result.block_num)
    }, function(error) {
        console.error(error)
    });
}

// example
comment("username", "password", "howo", "introducting-steemsnippets", 'Woah nice article');

