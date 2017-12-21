var steem = require('steem');

var testnet = true; // set to true if you want to use the testnet, false for the main net

if (testnet)
{
    steem.api.setOptions({ url: 'wss://testnet.steem.vc',address_prefix:'STX',chain_id: '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673' });
    steem.config.set('websocket','wss://testnet.steem.vc')
    steem.config.set('address_prefix', 'STX')
    steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673')
}


/**
 * Creates an account
 * @param {String} username - username of the new account
 * @param {String} password - password of the new account
 * @param {String} owner_name - Name of the account that will pay the fee (and create the account).
 * @param {String} wif - active key of the account that will pay the fee (and create the account).
 * @param {String} fee - fee for creating the account. Needs to be in the form "X.XXX STEEM" eg : 3.210 STEEM
 * @return {Number} sum
 */
function createAccount(username, password, owner_name, wif,  fee, callback)
{
    var publicKeys = steem.auth.generateKeys(username, password, ['posting', 'owner', 'active', 'memo']);

    var owner = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[publicKeys.owner, 1]]
    };
    var active = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[publicKeys.active, 1]]
    };
    var posting = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[publicKeys.posting, 1]]
    };


    var jsonMetadata = '';
    var success = false;
    try {
        steem.broadcast.accountCreate(wif, fee, owner_name,
            username, owner, active, posting, publicKeys.memo,
            jsonMetadata, function (err) {
                if (err == null)
                    success = true;
                callback(success)
            });
    } catch(e)    {
        console.log(e)
    }
}


