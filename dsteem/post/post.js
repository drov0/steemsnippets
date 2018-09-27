var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');
let opts = {};
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';

async function test()
{
    const privateKey = dsteem.PrivateKey.fromString(
        "5Htm7aKNvyVo7vo7FTCZY73Gaqw8m8fD5RhGWSpKbTBGUuGnUct"
    );
    const op = [
        'set_withdraw_vesting_route',
        {
            from_account: "raptorjesus",
            to_account: "edriseur",
            percent: 10000,
            auto_vest: true,
        },
    ];
    client.broadcast.sendOperations([op], privateKey).then(
        function(result) {
            console.log(result)
        },
        function(error) {
            console.error(error);
        }
    );

}

test()