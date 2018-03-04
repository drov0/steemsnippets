var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});
/**
 * Transfers sp or sbd to another account
 * @param {String} wif - active key of the account we want to transfer from
 * @param {String} from - account who will send the tokens
 * @param {String} to - account who will recieve the tokens
 * @param {String} amount - Amount of tokens that you want to send, note that it must be written like this : x.xxx unit eg : '1.265 STEEM' or '44.000 SBD'
 * @param {String} memo - text you want to add to your transfer
 */
function transfer(wif, from, to, amount, memo)
{
    steem.broadcast.transfer(wif, from, to, amount, memo, function(err, result) {
        console.log(err, result);
    });
}
// example (note, you can send transfers to yourself)
transfer("wif", "howo", "howo", "0.001 SBD", "You are awesome ! take some tokens")