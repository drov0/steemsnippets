var dsteem = require('dsteem');
var es = require('event-stream')

const steem = new dsteem.Client('https://rpc.buildteam.io');// We use buildteam's node as they are the fastest but feel free to use https://api.steemit.com

/**
 * From a block number, gets it and parses the informations within it to store them on the blockchain
 * @param {int} blocknb - block number to parse.
 */
async function parseBlock(blocknb) {
    console.log(blocknb);
    const block = await steem.database.getBlock(blocknb);
    const tx = block['transactions'];

    for (let i = 0; i < tx.length; i++) { // iterate over each transaction
        for (let y = 0; y < tx[i]['operations'].length; y++) { // iterate over each operation of each transaction
            if (tx[i]['operations'][y][0] === "comment") {
                const post = tx[i]['operations'][y][1];

                if (post['parent_author'] === "") // if the parent_author field is empty it's a post.
                {
                    console.log(post);

                } else
                {
                    // if parent_author is not empty then it's a comment
                    console.log(post);
                }
            }
            else if (tx[i]['operations'][y][0] === "vote") { // Vote
                const vote = tx[i]['operations'][y][1];

                console.log(vote);

            }
            else if (tx[i]['operations'][y][0] === "custom_json") {  // Almost all the time used to perform follow/unfollow
                const custom_json = tx[i]['operations'][y][1];

                if (custom_json['id'] === "follow") // Follow/unfollow
                {
                    const follow_data = JSON.parse(custom_json['json']);
                    console.log(follow_data);
                } else
                    console.log(custom_json); // Something else.

            }
            else if (tx[i]['operations'][y][0] === "transfer") { // Transfer steem/sbd
                const transfer = tx[i]['operations'][y][1];

                console.log(transfer);

            } else if (tx[i]['operations'][y][0] === "claim_reward_balance") { // Claim reward
                const claim_reward_balance = tx[i]['operations'][y][1];

                console.log(claim_reward_balance);

            } else if (tx[i]['operations'][y][0] === "comment_options") { // Comments options, generally used to set beneficiaries.
                const comment_options = tx[i]['operations'][y][1];

                console.log(comment_options);

            } else if (tx[i]['operations'][y][0] === "account_update") { // Update account infos (profile pic, description name etc).
                const account_update = tx[i]['operations'][y][1];

                console.log(account_update);

            } else if (tx[i]['operations'][y][0] === "limit_order_cancel") { // Cancel marketplace order
                const limit_order_cancel = tx[i]['operations'][y][1];

                console.log(limit_order_cancel);
            } else if (tx[i]['operations'][y][0] === "transfer_to_vesting") { // Power up
                const transfer_to_vesting = tx[i]['operations'][y][1];

                console.log(transfer_to_vesting);
            } else if (tx[i]['operations'][y][0] === "transfer_to_savings") { // Put steem/sbd in savings
                const transfer_to_savings = tx[i]['operations'][y][1];

                console.log(transfer_to_savings);
            } else if (tx[i]['operations'][y][0] === "feed_publish") { // price feed from a witness
                const feed_publish = tx[i]['operations'][y][1];

                console.log(feed_publish);
            }else if (tx[i]['operations'][y][0] === "account_witness_vote") { // vote/unvote for a witness
                const account_witness_vote = tx[i]['operations'][y][1];

                console.log(account_witness_vote);
            }else if (tx[i]['operations'][y][0] === "limit_order_create") { // Create a limit order on the internal market
                const limit_order_create = tx[i]['operations'][y][1];

                console.log(limit_order_create);
            }else if (tx[i]['operations'][y][0] === "account_create_with_delegation") { // Create an account with delegation
                const account_create_with_delegation = tx[i]['operations'][y][1];

                console.log(account_create_with_delegation);
            }else if (tx[i]['operations'][y][0] === "delete_comment") { // Delete a post/comment
                const delete_comment = tx[i]['operations'][y][1];

                console.log(delete_comment);
            }else if (tx[i]['operations'][y][0] === "delegate_vesting_shares") { // price feed from a witness
                const delegate_vesting_shares = tx[i]['operations'][y][1];

                console.log(delegate_vesting_shares);
            }else if (tx[i]['operations'][y][0] === "transfer_from_savings") { // withdrawal from saving account
                const transfer_from_savings = tx[i]['operations'][y][1];

                console.log(transfer_from_savings);
            }else if (tx[i]['operations'][y][0] === "withdraw_vesting") { // power down
                const withdraw_vesting = tx[i]['operations'][y][1];

                console.log(withdraw_vesting);
            } else if (tx[i]['operations'][y][0] === "account_witness_proxy") { // proxy witness vote
                const account_witness_proxy = tx[i]['operations'][y][1];

                console.log(account_witness_proxy);
            } else if (tx[i]['operations'][y][0] === "account_create") { // account create without delegation
                const account_create = tx[i]['operations'][y][1];

                console.log(account_create);
            }else if (tx[i]['operations'][y][0] === "cancel_transfer_from_savings") { // Cancel Transfer From Savings
                const cancel_transfer_from_savings = tx[i]['operations'][y][1];

                console.log(cancel_transfer_from_savings);
            }
            else {
                var something = tx[i]['operations'][y];
                console.log(something)
            }
        }
    }


}


/**
 * Main function tp start the stream
 * @param {int} from - Block from which to start streaming, most rpc nodes won't stream more than 100 blocks in one go so be careful
 */
async function main(from) {
    console.log("Starting parser");

    let stream = null;

    if (from) {
        stream = steem.blockchain.getBlockNumberStream({from: lastblock});
    }
    else
        stream = steem.blockchain.getBlockNumberStream();

    stream.pipe(es.map(function (block, callback) {
        callback(null, parseBlock(block))
    }));

}


main();

