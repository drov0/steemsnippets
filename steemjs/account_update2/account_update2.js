var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});

function broadcast(tx, wif)
{
    return new Promise(resolve => {
        steem.broadcast.send(tx, {wif}, async function (err, result) {
                return resolve(result)
        });
    });
}

// example
// if you get error, make sure that you have the latest steem-js version.
async function account_update2(json_metadata, posting_key) {
return new Promise(async resolve => {

    let ops = [];

    let username = "howo";

    ops.push(['account_update2', {
        'account': username,
        "posting_json_metadata": JSON.stringify(json_metadata),
        "json_metadata": ""
    }]);

    const result = await broadcast({operations: ops, extensions: []}, posting_key)
    return resolve(result)
});
}

async function main() {
    const result = await account_update2({profile: {location : "somewhere..."}}, "posting key");
    console.log(result)
}

main();
