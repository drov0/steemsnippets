var steem = require('steem');

/**
 * Creates an account, note that almost no validation is done.
 * @param {String} username - username of the account
 * @param {String} password - password of the account
 * @param {String} main_tag - The main tag for the post
 * @param {String} title - Title of the post
 * @param {String} body - body (content) of the post.
 * @param {String} [jsonMetadata] - dictionnary with additional tags, app name, etc,
 * @param {String} [permlink] - permanent link, by default it's the date + -post. eg : 20171237t122520625z-post
 */
function post(username, password, main_tag, title, body, jsonMetadata, permlink) {
    var wif = steem.auth.toWif(username, password, 'posting');
    // By default permlink will be the date
    permlink = permlink || new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    jsonMetadata = jsonMetadata || {};

    steem.broadcast.comment(wif, '',  main_tag, username, permlink + '-post', title, body, jsonMetadata, function (err, result) {
        console.log(err, result);
    });
}
// example
post("username", "password", "tag1", "title", "body");

