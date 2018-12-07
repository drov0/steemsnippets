var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
// GET_STATE IS DEPRECATED, THIS SNIPPET PROBABLY DOESNT WORK NOW
// Please check out https://github.com/drov0/steemsnippets/tree/master/dsteem/get_all_comments instead
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================


/**
 *
 * From a comment (username and permlink) get the original post(username and permlink) on which it was done
 * @param {String} author - username of the author
 * @param {String} permlink - permlink of the post
 * @param {String} tag - primary tag of the post
 *
 * @return {Object} an object with all the comments ordered
 */
function get_all_comments(author, permlink, tag)
{
    return new Promise(resolve => {
        steem.api.getState(tag+"/@"+author+"/"+permlink, async function (err, post) {
            if (err)
                return resolve({error:err});

            if (post['root_permlink'] === "" && post['root_author'] === "" )
                return resolve({error:"content not found"});

            let comment_list = post.content;
            let comments_ordered = [];
            // remove the post itself
            //delete comment_list[author+"/"+permlink];

            for (const comment_id in comment_list) {

                let comment = comment_list[comment_id];

                if (comment.depth !== 0)
                    continue;
                comments_ordered.push(get_replies(comment, comment_list));
            }

            return resolve(comments_ordered);
        });
    });
}

function get_replies(comment, comment_list)
{
    for (let i = 0; i < comment.replies.length; i++) {
        let reply = comment_list[comment.replies[i]];
        comment.replies[i] = get_replies(reply, comment_list);
    }
    return comment;
}


// Replies objects are located in the "replies" field.
async function example()
{
    let data =  await get_all_comments("petanque", "testcomments-xylmwuwi6p", "steempress");
    console.log(data);
}


example();
