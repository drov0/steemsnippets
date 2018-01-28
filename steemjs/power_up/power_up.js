var steem = require('steem');

/**
 * Powers up tokens into STEEM Power
 * @param {String} username - username of the account
 * @param {String} Activekey - Private active key of the account
 * @param {String} amount - Amount of tokens that you want to power up, note that it must be written like this : x.xxx unit eg : '1.265 STEEM' or '0.010 STEEM'

 */
function powerup(Activekey, username, amount) {
    steem.broadcast.transferToVesting(Activekey, username, username, amount, function(err, result) {
        console.log(err, result);
    });
}

// example :
powerup("Activekey", "yourusername", "0.100 STEEM")