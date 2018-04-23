var steem = require('steem');
steem.api.setOptions({url: 'https://api.steemit.com'});

/**
 * From a comment (username and permlink) get the original post(username and permlink) on which it was done
 * @param {String} author - username of the author
 * @param {String} permlink - permlink of the post
 *
 * @return {Object} an object with the original post permlink and author
 */
function get_root_post(author, permlink)
{
    return new Promise(resolve => {
        steem.api.getContent(author, permlink, async function (err, post) {
            if (err)
                return resolve({error:err});

            if (post['root_permlink'] === "" && post['root_author'] === "" )
                return resolve({error:"content not found"});

            return resolve({"root_permlink":post['root_permlink'], "root_author": post['root_author']});
        });
    });
}

// example
async function example()
{
    // working example
    let data =  await get_root_post("howo", "re-pixelhosting-pixelhosting-by-wehmoen-free-image-hosting-for-steem-projects-20180422t001219308z");
    console.log(data); // { root_permlink: 'pixelhosting-by-wehmoen-free-image-hosting-for-steem-projects', root_author: 'pixelhosting' }

    // comment that doesn't exist
    data =  await get_root_post("howo", "re-pixeddddlhosting-pixelhosting-by-wehmoen-free-image-hosting-for-steem-projects-20180422t001219308z");
    console.log(data) // { error: 'content not found' }
}


example();

