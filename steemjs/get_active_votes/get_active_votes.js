var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});

/**
 * Checks if a post is awaiting payout
 * @param {string} author - Username of the user who created the post
 * @param {string} permlink - permlink of the post
 */
function is_post_active(author, permlink)
{
    return new Promise(resolve => {
        var _7_days_ago = Math.floor(new Date().getTime() / 1000) - 86400 * 7;
        steem.api.getContent(author, permlink, function (err, post_result) {

            var created_date = Math.floor(Date.parse(post_result['created']) / 1000);

            if (created_date - _7_days_ago > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        });
    });
}

/**
 * Gets the votes from an user on posts that are still awaiting payout
 * @param {string} username - Username of the user from which to get the active votes
 */
function get_active_votes(username)
{
    return new Promise( resolve => {
        var _7_days_ago = Math.floor(new Date().getTime() / 1000) - 86400 * 7;
        var active_votes = [];

        steem.api.getAccountVotes(username,async function (error, result) {

            for (var i = 0; i < result.length; i++) {

                var post_time = Math.floor(Date.parse(result[i]['time']) / 1000);

                if (post_time  - _7_days_ago > 0) {

                    var author = result[i]['authorperm'].substring(0, result[i]['authorperm'].indexOf("/"));
                    var permlink = result[i]['authorperm'].substring(result[i]['authorperm'].indexOf("/")+1);

                    var active = await is_post_active(author, permlink);

                    if (active)
                        active_votes.push(result[i])
                }
            }
            resolve(active_votes);
        });
    });

}

// example
// if you get error, make sure that you have the latest node version.
async function main() {
    var active_votes = await get_active_votes("jesta");
    console.log(active_votes);
}

main()
