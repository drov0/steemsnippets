var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');

/**
 * Equivalent of steem-js's getContent in one function.
 * @param {String} author - Author of the post to getContent to
 * @param {String} permlink - permanent link of the post to getContent to. eg : https://steemit.com/programming/@howo/introducting-steemsnippets the permlink is "introducting-steemsnippets"
 */
function getContent(author, permlink) {
    return new Promise(async resolve => {
        const article = await client.database.getDiscussions('blog', {tag: author, start_author: author, start_permlink: permlink, limit: 1});
        return resolve(article);
    });
}

// example
getContent("howo", "steem-reward-manager-conversion-update");

