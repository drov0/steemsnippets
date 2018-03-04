var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});
var Asset = require('dsteem').Asset;

var testnet = true; // set to true if you want to use the testnet, false for the main net

if (testnet)
{
    steem.api.setOptions({ url: 'wss://testnet.steem.vc',address_prefix:'STX',chain_id: '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673' });
    steem.config.set('websocket','wss://testnet.steem.vc')
    steem.config.set('address_prefix', 'STX')
    steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673')
}
/*

Example on how to use the function :

var wif = steem.auth.toWif("how", "barman", 'active');
createAccount("newaccount", "newaccountpassword", "how", wif, function (success) {
    console.log(success)
});
*/

/**
 * Creates an account, note that almost no validation is done.
 * @param {String} username - username of the new account
 * @param {String} password - password of the new account
 * @param {String} owner_name - Name of the account that will pay the fee (and create the account).
 * @param {String} wif - active key of the account that will pay the fee (and create the account).
 * @param {callback} callback - callback with a boolean containing whether the account creation was successfull or not.
 */
function createAccount(username, password, owner_name, wif, callback)
{

    // Generate the keypairs
    var publicKeys = steem.auth.generateKeys(username, password, ['posting', 'owner', 'active', 'memo']);

    // Create the key objects
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


    // Get the the steem blockchain configuration
    steem.api.getConfig(function(err, config) {
        if (err) {
            console.log(err, config);
            throw new Error(err);
        }
        // Get the steem blockchain properties
        steem.api.getChainProperties(function (err2, chainProps) {
            if (err2) {
                console.log(err2, chainProps);
                throw new Error(err2);
            }

            // Get the ratio to create an account without delegation, as of writing this it's 30.
            var ratio = config['STEEMIT_CREATE_ACCOUNT_WITH_STEEM_MODIFIER'];
            // Get the account creation fee and multiply it by the ratio to get the fee needed to create an account without delegation
            var fee = Asset.from(chainProps.account_creation_fee).multiply(ratio);
            // Get the fee in the format for accountCreate aka "X.XXX STEEM"
            var feeString = fee.toString();

            var jsonMetadata = '';
            var success = false;
            try {
                steem.broadcast.accountCreate(wif, feeString, owner_name,
                    username, owner, active, posting, publicKeys.memo,
                    jsonMetadata, function (err) {
                        if (err == null)
                            success = true;
                        callback(success)
                    });
            } catch(e)    {
                console.log(e)
            }
        });
    });

}

