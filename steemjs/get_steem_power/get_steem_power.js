var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});
/**
 * Posts a comment on an already existing article
 * @param {String} username - username of the account
 @returns {Promise.<Object>} Oject containing the steem power and delegated steem power
 @fulfils {float} steem_power - steem power of the user (without taking into account the delegations)
 @fulfils {float} delegated_steem_power - delegated steem power to/from the user this can go negative if it's a delegation that is sent.
 */
function get_steem_power(username) {

    const steem = require('steem');
    steem.api.setOptions({url: 'https://rpc.buildteam.io'});

    return new Promise(resolve => {
    steem.api.getAccounts([username], function (err, account) {
        if (err) {
            console.log(err)
            return resolve(get_steem_power(username)); // recursion in case of rpc error.
        }
        var vesting_shares, delegated_vesting_shares, received_vesting_shares, total_vesting_shares = null;
        vesting_shares = account[0].vesting_shares;
        delegated_vesting_shares = account[0].delegated_vesting_shares;
        received_vesting_shares = account[0].received_vesting_shares;

        steem.api.getDynamicGlobalProperties(function (err, properties) {
            if (err) {
                console.log(err)
                return resolve(get_steem_power(username)); // recursion in case of rpc error.
            }

            total_vesting_shares = properties.total_vesting_shares;
            let total_vesting_fund = properties.total_vesting_fund_steem;

            // Handle Promises, when you’re sure the two functions were completed simply do:
            var steem_power = steem.formatter.vestToSteem(vesting_shares, total_vesting_shares, total_vesting_fund);
            var delegated_steem_power = steem.formatter.vestToSteem((received_vesting_shares.split(' ')[0] - delegated_vesting_shares.split(' ')[0]) + ' VESTS', total_vesting_shares, total_vesting_fund);

            steem_power = Math.floor(steem_power*1000)/1000;
            delegated_steem_power = Math.floor(delegated_steem_power*1000)/1000;

            resolve({"steem_power" : steem_power, "delegated_steem_power" : delegated_steem_power});
            });
        });
    });
}


// example
async function example()
{
    const data =  await get_steem_power("howo");
    console.log("howo has "+ data.steem_power + " steem power and has "+ data.delegated_steem_power + " delegated steem power, so his current steem power is " + (data.steem_power+data.delegated_steem_power))
}


example()
