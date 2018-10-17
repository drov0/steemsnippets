var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');

/**
 * Creates a discounted account, note that you need to claim discounted accounts before being able to create them this way.
 * @param {String} creator - Name of the account that will create the new account. This account must have at least one claimed discounted account.
 * @param {String} active_key - Active key of the creator account
 * @param {String} username - username of the account to be created
 * @param {String} password - password of the account to be created.
 */
function create_discounted_account(creator, active_key, username, password)
{
    return new Promise(resolve => {
        const wif = dsteem.PrivateKey.fromString(active_key);

        const prefix = client.addressPrefix;

        const ownerKey = dsteem.PrivateKey.fromLogin(username, password, 'owner').createPublic(prefix);
        let owner = dsteem.Authority.from(ownerKey);
        const activeKey = dsteem.PrivateKey.fromLogin(username, password, 'active').createPublic(prefix);
        let active = dsteem.Authority.from(activeKey);
        const postingKey = dsteem.PrivateKey.fromLogin(username, password, 'posting').createPublic(prefix);
        let posting = dsteem.Authority.from(postingKey);
        let memo_key = dsteem.PrivateKey.fromLogin(username, password, 'memo').createPublic(prefix);

        const metadata =  {date: new Date()};

        const create_op = [
            'create_claimed_account',
            {
                active,
                creator,
                extensions: [],
                json_metadata: metadata ? JSON.stringify(metadata) : '',
                memo_key,
                new_account_name: username,
                owner,
                posting,
            }
        ];


    client.broadcast.sendOperations([create_op], wif).then(function (result) {
        console.log('Included in block: ' + result.block_num);
        resolve("=");
    }, function (error) {
        console.error(error);
        resolve("-");
    });
});
}

async function example() {
        const creator = "creator_account";
        const active_key = "creator_active_key";
        const new_account = "new_account_username";
        const new_account_password = "baguette";
        await create_discounted_account(creator, active_key, new_account, new_account_password);
}

example();