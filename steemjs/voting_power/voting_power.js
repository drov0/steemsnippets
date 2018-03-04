var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});
/**
 * Gets the voting power of an account. code mostly by stoodkev
 * @param {String} account - account of whom we want to check the steem power
 * @param {String} callback - callback which will have the voting power as parameter
 */
function getvotingpower(account, callback) {
    steem.api.getAccounts([account], function (err, response) {
        var secondsago = (new Date - new Date(response[0].last_vote_time + "Z")) / 1000;
        var vpow = response[0].voting_power + (10000 * secondsago / 432000);
        vpow = Math.min(vpow / 100, 100).toFixed(2);
        callback(vpow);
    });
}
// example
getvotingpower("howo", function (vpower) {
    console.log(vpower)
});