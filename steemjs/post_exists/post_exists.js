var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});

/**
 * Checks if a post exists, it's really usefull to check before trying actions on it (voting commenting etc) as people can delete their posts.
 * @param {string} author - Username of the user who created the post
 * @param {string} permlink - permlink of the post you want to check
 * @return {Boolean}  - true if it exists, false if it doesn't
 */
function post_exists(author, permlink) {
    return new Promise(resolve => {
        {
            var steem = require('steem');

            steem.api.setOptions({url: 'https://api.steemit.com'});

            steem.api.getContent(author, permlink, function (err, result) {

                if (result['author'] === "")
                    resolve(false);
                else
                    resolve(true);
            });
        }})
}



// example
// if you get error, make sure that you have the latest node version.
async function main() {
    // this exists : https://steemit.com/utopian-io/@howo/steemsnippets-1-2-3-power-up-get-active-votes-and-get-lastest-posts-from-tags
    var exists = await post_exists("howo", "steemsnippets-1-2-3-power-up-get-active-votes-and-get-lastest-posts-from-tags");
    console.log(exists);
    // this post does not exists
    var not_existing = await post_exists("howo", "nonexistant");
    console.log(not_existing);
}

main()