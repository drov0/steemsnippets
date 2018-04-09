
/**
 * Gets the number of followers and number of followed accounts.
 * @param {String} username - username of the account
 @returns {Promise.<Object>} Oject containing the number of followers and number of follows
 @fulfils {int} followers - number of followers
 @fulfils {int} following - Number of users the account is following.
 */

function get_followers_following(username) {
    var steem = require('steem');
    steem.api.setOptions({url: 'https://api.steemit.com'});

    return new Promise(resolve => {

        steem.api.getFollowCount(username, function (err, follow_data) {
            if (err) {
                console.log(err);
                return resolve(get_followers_following(username)); // in case of an rpc error, we call the function recursively
            }

            const followers = follow_data.follower_count;
            const following = follow_data.following_count;

            resolve({"followers":followers, "following":following});

        });
    });
}


// example

// Note : if you have errors with the await, make sure your node is up to date to support ES6.

async function example()
{
    const data =  await get_followers_following("howo");
    console.log("howo has "+ data.followers + " followers and he's following "+ data.following + " users. ")
}


example();
