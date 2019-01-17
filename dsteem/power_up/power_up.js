var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');

/**
 * Powers up x amounts of steem
 * @param from Account from which the liquid steem will be drained
 * @param to Account on which the liquid steem will be powered up (can be the same as the account from which the steem will be drained)
 * @param amount Amount of tokens that you want to power up, note that it must be written like this : x.xxx unit eg : '1.265 STEEM' or '0.010 STEEM'
 * @param active_key Active key of the from account.
 * @returns {Promise<any>} Result of the operation.
 */
function power_up(from, to,  amount, active_key) {
    return new Promise(async resolve => {

        const privateKey = dsteem.PrivateKey.fromString(
            active_key
        );
        const op = [
            'transfer_to_vesting',
            {
                from: from,
                to: to,
                amount: amount,
            },
        ];
        const result = await client.broadcast.sendOperations([op], privateKey).catch(function(error) {
                console.error(error);
            }
        );

        return resolve(result);

    });
}

// example
power_up("howo", "howo", "1.000 STEEM", "private active key");

