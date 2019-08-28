var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');

/**
 * Gets the downvoting power percentage
 * @param {String} username - Username to get the downvoting pool percentage from
 */
function get_downvoting_power(username) {

    return new Promise(async resolve => {
        let account = await client.database.getAccounts([username]);

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
}

// example
async function test()
{
    console.log(await  get_downvoting_power("howo"));
}

test();
