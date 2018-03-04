var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});

/**
 * Tests if an username/password pair is correct
 * @param {String} username - username of the account
 * @param {String} password - password of the account
 * @return {boolean} valid - True if the password is correct, false if not (or if the account doesn't exists)
 */
function login_using_password(username, password) {
    // Get the private posting key
    var wif = steem.auth.toWif(username, password, 'posting');

    steem.api.getAccounts([username], function (err, result) {
        // check if the account exists
        if (result.length !== 0) {
            // get the public posting key
            var pubWif = result[0].posting.key_auths[0][0];
            var valid = false;
            try {
                // Check if the private key matches the public one.
                valid = steem.auth.wifIsValid(wif, pubWif)
            } catch (e) {
            }
            return valid;
        }
        return false;
    });
}

/**
 * Tests if an username/password pair is correct
 * @param {String} username - username of the account
 * @param {String} wif - Private key used for login
 * @param {String} type - Type of the private key, can be "posting", "active" or "owner"
 * @return {boolean} valid - True if the password is correct, false if not (or if the account doesn't exists)
 */
function login_using_wif(username, wif, type) {
    // Get the private posting key

    steem.api.getAccounts([username], function (err, result) {
        // check if the account exists
        if (result.length !== 0) {
            // get the public posting key
            if (type === "posting")
                var pubWif = result[0].posting.key_auths[0][0];
            else if (type === "active")
                var pubWif = result[0].active.key_auths[0][0];
            else if (type === "owner")
                var pubWif = result[0].owner.key_auths[0][0];

            var valid = false;
            try {
                // Check if the private key matches the public one.
                valid = steem.auth.wifIsValid(wif, pubWif)
            } catch (e) {
            }
            return valid;
        }
        return false;
    });
}