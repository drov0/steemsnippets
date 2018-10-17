var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');

/**
 * claims a discounted account.
 * @param {String} creator - Name of the account that will claim the discounted account.
 * @param {String} active_key - Active key of the creator account
 */
function claim_account(creator, active_key)
{
    return new Promise(resolve => {
        const wif = dsteem.PrivateKey.fromString(active_key);

    const fee = dsteem.Asset.from(0, 'STEEM');

    const op = [
        'claim_account',
        {
            creator: creator,
            extensions: [],
            fee: fee
        }];

    client.broadcast.sendOperations([op], wif).then(function (result) {
        console.log('Included in block: ' + result.block_num)
        resolve("=");
    }, function (error) {
        console.error(error);
        resolve("-");
    });
});
}

async function example() {
        await claim_account("username", "active_key");

}

example();