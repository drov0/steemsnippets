var steem = require('steem');

var testnet = false; // set to true if you want to use the testnet

if (testnet)
{
    steem.api.setOptions({ url: 'wss://testnet.steem.vc',address_prefix:'STX',chain_id: '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673' });
    steem.config.set('websocket','wss://testnet.steem.vc')
    steem.config.set('address_prefix', 'STX')
    steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673')
} else
{
    steem.api.setOptions({url: 'https://api.steemit.com'});
}


steem.api.getAccounts(['foo'], function(err, response){
    console.log(response[0].balance); // Should be 0.000 STEEM for the mainnet and 1M+ for the testnet
});



