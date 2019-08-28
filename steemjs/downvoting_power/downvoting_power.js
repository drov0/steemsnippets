var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});
/**
 * Gets the downvoting power of an account.
 * @param {String} account_name - account of whom we want to check the downvoting power
 */
function get_downvoting_power(account_name) {
    return new Promise(resolve => {
        steem.api.getAccounts([account_name], function (err, account) {

            account = account[0];

            const totalShares = parseFloat(account.vesting_shares) + parseFloat(account.received_vesting_shares) - parseFloat(account.delegated_vesting_shares) - parseFloat(account.vesting_withdraw_rate);

            const elapsed = Math.floor(Date.now() / 1000) - account.downvote_manabar.last_update_time;
            const maxMana = totalShares * 1000000 / 4;
            // 432000 sec = 5 days
            let currentMana = parseFloat(account.downvote_manabar.current_mana) + elapsed * maxMana / 432000;

            if (currentMana > maxMana) {
                currentMana = maxMana;
            }

            const currentManaPerc = currentMana * 100 / maxMana;

            return resolve(currentManaPerc);
        });
    });
}


async function example()
{
    const vp = await get_downvoting_power("howo");
    console.log(vp);
}

example();