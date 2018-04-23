var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});

/**
 * From a comment (username and permlink) get the original post(username and permlink) on which it was done
 * @param {String} username - username of the author
 *
 * @return {Object} an object with the simplified and raw reputation
 */
function get_reputation(username)
{
    return new Promise(resolve => {

        steem.api.getAccounts([username], function (err, account) {
            if (err) {
                console.log(err);
                return resolve({error : err});
            }

            if (account.length === 0)
                return resolve({error : "Account doesn't exist"});

            const simplified_reputation = steem.formatter.reputation(account[0].reputation);

            resolve({simplified_reputation : simplified_reputation, raw_reputation : account[0].reputation});

        });
    });
}


// example
async function example()
{
    // working example
    let data =  await get_reputation("howo");
    console.log(data); // { simplified_reputation: 63, raw_reputation: '17178492578569' }

    // account that doesn't exist
    data =  await get_reputation("a");
    console.log(data) // { error: 'Account doesn't exist' }
}


example();

