const utils = require('./utils');
const moment = require("moment");
const dsteem = require('dsteem');

const client = new dsteem.Client('https://api.steemit.com');

function build_get_replies(reply)
{
    return new Promise(async resolve => {

        console.log(reply.depth);

        reply.active_votes =  await client.database.call("get_active_votes", [reply.author, reply.permlink]);

        const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
        const chosenDate = moment.unix(new Date(reply.created).getTime() / 1000);
        reply.unix = chosenDate.unix();
        reply.date = chosenDate.from(new Date().getTime()  + userTimezoneOffset);

        reply.reputation = utils.repLog10(reply.author_reputation);

        const total_payout =
            parseFloat(reply.pending_payout_value) +
            parseFloat(reply.total_payout_value) +
            parseFloat(reply.curator_payout_value);

        reply.total_payout = (Math.floor(parseFloat(total_payout) * 100) / 100);

        reply.upvotes = reply.active_votes.length;

        const voteRshares = reply.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);

        const ratio = (voteRshares === 0 ? 0 : reply.total_payout / voteRshares);

        reply.active_votes.map((vote) => {
            vote.value = Math.floor((vote.rshares * ratio)*100)/100;
            if (vote.percent === 0)
                reply.active_votes.splice(reply.active_votes.indexOf(vote), 1)
        });

        reply.active_votes.sort(utils.compare_votes);


        if (reply.children > 0)
        {
            reply.replies = await client.database.call("get_content_replies", [reply.author, reply.permlink]);


            for (let i = 0; i < reply.replies.length; i++) {
                reply.replies[i] = await build_get_replies(reply.replies[i]);
            }

            return resolve(reply);
        } else
        {
            return resolve(reply);
        }


    })
}

function build_comment_data(author, permlink)
{
    return new Promise(async resolve => {
        let post = await client.database.call("get_content", [author, permlink]).catch(function (err) {
            console.error(err);
            });

        if (post['root_permlink'] === "" && post['root_author'] === "" )
            return resolve(post);

        post.replies = await client.database.call("get_content_replies", [author, permlink]).catch(function (err) {
                return resolve({error: err.message, comments: ""});
            });

        for (let i = 0; i < post.replies.length; i++) {
            post.replies[i] = await build_get_replies(post.replies[i]);
        }

        return resolve(post);
    });
}

/**
 *
 * From a comment (username and permlink) get the original post(username and permlink) on which it was done
 * @param {String} author - username of the author
 * @param {String} permlink - permlink of the post
 * @return {Object} an object with all the comments ordered
 */

function get_all_comments(author, permlink)
{
    return new Promise(async resolve => {

        if (author === "" || permlink === "")
            return resolve({error:"Post not found", comments : ""});

        const post = await build_comment_data(author, permlink);

        if (post['root_permlink'] === "" && post['root_author'] === "" )
            return resolve({error:"Post not found", comments : ""});

        return resolve({comments : post});
    });
}

async function test() {
    var data = await get_all_comments("petanque", "testcomments-xylmwuwi6p");

    if (data.comments === "" && data.error !== undefined) {
        console.error(data.error);
     }
}

test();
