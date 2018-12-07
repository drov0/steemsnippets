const utils = require('./utils');
const moment = require("moment");
const dsteem = require('dsteem');

const client = new dsteem.Client('https://api.steemit.com');

const steem_bots = [
    "upme",
    "postpromoter",
    "boomerang",
    "coin.info",
    "arcange",
    "steemcleaners",
    "bid4joy",
    "onlyprofitbot",
    "brupvoter",
    "upmewhale",
    "joeparys",
    "booster",
    "emperorofnaps",
    "spydo",
    "dailyupvotes",
    "minnowvotes",
    "minnowbooster",
    "oceanwhale",
    "steemitboard",
    "cheetah"
];



function get_all_comments(author, permlink)
{
    return new Promise(async resolve => {

        if (author === "" || permlink === "")
            return resolve({error:"Post not found", comments : ""});

        const post = await client.database.getState("a/@"+author+"/"+permlink).catch(function (err) {
            return resolve({error : err.message, comments : ""});
        });

        if (post.error !== "")
            return resolve({error : post.error, comments : ""});

        if (post['root_permlink'] === "" && post['root_author'] === "" )
            return resolve({error:"Post not found", comments : ""});

        let comment_list = post.content;
        let comments_ordered = [];
        let author_list = new Set([]); // will be used later to query the blockchain for user avatars

        for (const comment_id in comment_list) {

            let comment = comment_list[comment_id];

            if (comment.depth !== 0)
                continue;

            comments_ordered.push(await get_replies(comment, comment_list, author_list));
        }

        return resolve({comments:comments_ordered});
    });
}





async function get_replies(comment, comment_list, author_list)
{
    return new Promise(async resolve => {
        author_list.add(comment.author);

        const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
        const chosenDate = moment.unix(new Date(comment.created).getTime() / 1000);
        comment.unix = chosenDate.unix();
        comment.date = chosenDate.from(new Date().getTime()  + userTimezoneOffset);

        comment.reputation = utils.repLog10(comment.author_reputation);

        const total_payout =
            parseFloat(comment.pending_payout_value) +
            parseFloat(comment.total_payout_value) +
            parseFloat(comment.curator_payout_value);

        comment.total_payout = (Math.floor(parseFloat(total_payout) * 100) / 100);

        //const vote_data = count_votes(comment.active_votes);
        comment.upvotes = comment.active_votes.length;

        const voteRshares = comment.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);

        const ratio = (voteRshares === 0 ? 0 : comment.total_payout / voteRshares);

        comment.active_votes.map((vote) => {
            vote.value = Math.floor((vote.rshares * ratio)*100)/100;
            if (vote.percent === 0)
                comment.active_votes.splice(comment.active_votes.indexOf(vote), 1)
        });

        comment.active_votes.sort(utils.compare_votes);



        for (let i = 0; i < comment.replies.length; i++) {
            let reply = comment_list[comment.replies[i]];


            if (steem_bots.indexOf(reply.author) !== -1)
                continue;

            reply.body = await utils.parse_text(reply.body);
            comment.replies[i] = await get_replies(reply, comment_list, author_list);
        }


        return resolve(comment);
    });
}

function get_comment_nb(comment)
{
    let comment_nb = 0;

    if (comment.total_payout === undefined) {
        return comment_nb - 1;
    }

    comment_nb += comment.replies.length;

    for (let i = 0; i < comment.replies.length; i++) {
        let reply = comment.replies[i];
        comment_nb += get_comment_nb(reply);
    }

    return comment_nb;
}


async function test() {
    var data = await get_all_comments("petanque", "testcomments-xylmwuwi6p");
    console.log(data);
}

test()
