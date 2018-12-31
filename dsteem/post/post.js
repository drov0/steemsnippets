var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');
/**
 * Posts an article on the steem blockchain 
 * @param {String} username - username of the account
 * @param {String} password - password of the account
 * @param {String} main_tag - The main tag for the post
 * @param {String} title - Title of the post
 * @param {String} body - body (content) of the post.
 * @param {String} [jsonMetadata] - Json string with additional tags, app name, etc,
 * @param {String} [permlink] - permanent link, by default it's the date + -post. eg : 20171237t122520625z-post
 */
function post(username, password, main_tag, title, body, jsonMetadata, permlink) {
    var wif = dsteem.PrivateKey.fromLogin(username, password, 'posting')
    // By default permlink will be the date
    permlink = permlink || new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    jsonMetadata = jsonMetadata || "";

    client.broadcast.comment({
        author: username,
        title : title,
        body : body,
        json_metadata : jsonMetadata,
        parent_author : '' ,
        parent_permlink: main_tag,
        permlink : permlink
    }, wif).then(function(result){
        console.log('Included in block: ' + result.block_num)
    }, function(error) {
        console.error(error)
    });

}
// example
post("username", "Password", "tag1", "title", "body", '{"tags": ["tag2", "tag3"]}');

