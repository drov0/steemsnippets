var rp = require('request-promise-native');
var fs = require('fs');
var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');

const cache_path = __dirname+"/curator_cache";

/**
 * Save voter data to a cache file
 * @param username of the voter
 * @param author of the oldest active post voted
 * @param permlink of the oldest active post voted
 */
function save_curator_data(username, author, permlink)
{
    let current_json = {};

    if (fs.existsSync(cache_path)) {
        current_json = JSON.parse(fs.readFileSync(cache_path).toString());
    }

    current_json[username] = {author : author, permlink : permlink}

    fs.writeFileSync(cache_path, JSON.stringify(current_json));
}

/**
 * Returns the vote data of an user
 * @param username of the voter
 * @returns {*} the author and permlink of the oldest active post voted.
 */
function get_voter_data(username)
{
    if (fs.existsSync(cache_path)) {
        let data = JSON.parse(fs.readFileSync(cache_path).toString());

        if (data[username] !== undefined)
            return {author : data[username].author, pemlink : data[username].permlink};
        else
            return {author : "", pemlink : ""}
    } else
    {
        return {author : "", pemlink : ""}
    }
}

/**
 * Removes the votes that are older than 7 days from an array of votes
 * @param vote_list array of votes object
 * @returns {*} a cleaned list of votes.
 */
function remove_unactive_votes(vote_list)
{
    const seven_days_ago = Math.floor(new Date().getTime() / 1000) - 86400 * 7;

    for (let i = 0; i < vote_list.length; i++)
    {
        const created_date = Math.floor(Date.parse(vote_list[i].last_update) / 1000);

        if (created_date - seven_days_ago > 0 && vote_list[i].num_changes === 0) {

            const elements_to_keep = vote_list.length - i;
            return vote_list.slice(vote_list.length - elements_to_keep)
        }
    }
    return [];
}

/**
 * Gets all the active votes of a voter and cleans them.
 * @param voter to grab votes from
 * @param author (optional) author of a post to start the search from, post has to have been voted by the voter
 * @param permlink (optional) permlink of a post to start the search from, post has to have been voted by the voter
 * @returns {Promise<any>} list of votes
 */
function list_votes(voter, author = "", permlink = "")
{
    return new Promise(async resolve => {
        let total_votes = [];
        let votes = await get_list_votes(voter, author, permlink);

        if (votes.error !== undefined)
            return resolve(votes);

        votes = votes.votes;


        votes = clean_votes(votes, voter);
        total_votes.push(...votes);

        while (votes.length === 1000) {
            votes = await get_list_votes(voter, votes[999].author, votes[999].permlink);

            if (votes.error !== undefined)
                return resolve(votes);

            votes = votes.votes;
            votes = clean_votes(votes, voter);
            total_votes.push(...votes);
        }

        return resolve(remove_unactive_votes(total_votes));
    });
}

/**
 * Calls the rpc to get the list of votes.
 * @param voter to grab votes from
 * @param author (optional) author of a post to start the search from, post has to have been voted by the voter
 * @param permlink (optional) permlink of a post to start the search from, post has to have been voted by the voter
 * @returns {Promise<any>} list of votes
 */
function get_list_votes(voter, author, permlink)
{
    return new Promise(resolve => {
        var options = {
            method: 'POST',
            uri: 'https://api.steemit.com',
            body: {
                jsonrpc : "2.0",
                method : "database_api.list_votes",
                params : {
                    start: [voter, author, permlink],
                    limit: 1000,
                    order: "by_voter_comment",
                },
                id : 1
            },
            json: true // Automatically stringifies the body to JSON
        };

        rp(options)
            .then(function (body) {
                if (body.error) {
                    console.error(body.error.message);
                    return resolve({error : body.error, votes : []})
                }
                return resolve({votes : body.result.votes});
            })
            .catch(function (err) {
                console.log(err);
                return resolve({error : err, votes : []})
            });
    });
}

/**
 * Removes votes that are not from the voter in a list of votes
 * @param votes list of votes
 * @param voter that we want the votes from
 * @returns {Array} cleaned list of votes
 */
function clean_votes(votes, voter)
{
    let clean_array = [];

    for (let i = 0; i < votes.length; i++)
    {
        if (votes[i].voter === voter)
            clean_array.push(votes[i]);
    }

    return clean_array;

}

/**
 * Allows to set a sleep in the program
 * @param time to sleep in seconds
 * @returns {Promise<any>}
 */
function wait(time)
{
    return new Promise(resolve => {
        setTimeout(() => resolve('☕'), time*1000); // miliseconds to seconds
    });
}



/**
 * Checks if a post is awaiting payout
 * @param {string} author - Username of the user who created the post
 * @param {string} permlink - permlink of the post
 */
function is_post_active(author, permlink)
{
    return new Promise(async resolve => {
        var _7_days_ago = Math.floor(new Date().getTime() / 1000) - 86400 * 7;
        const post = await client.database.call("get_content", [author, permlink]);

        var created_date = Math.floor(Date.parse(post['created']) / 1000);

        if (created_date - _7_days_ago > 0) {
            resolve(true)
        } else {
            resolve(false)
        }
    });
}

/**
 * Gets all the active votes from an user
 * @param username to grab the votes from
 * @returns {Promise<any>} list of active votes.
 */

function get_active_votes(username)
{
    return new Promise(async  resolve => {
        let active_votes = [];

        let curator_data = get_voter_data(username)

        let author = curator_data.author;
        let permlink = curator_data.pemlink;

        let result = await list_votes(username, author, permlink);

        while (result.error !== undefined)
        {
            console.log("get_account_votes error, waiting");
            await wait(0.5);
            result = await list_votes(username, author, permlink);
        }


        if (result.length === 0)
            return resolve([]);

        author = result[0].author;
        permlink = result[0].permlink;


        save_curator_data(username, author, permlink);

        for (let i = 0; i < result.length; i++) {
                const active = await is_post_active(result[i].author, result[i].permlink);
                if (active)
                    active_votes.push(result[i])
        }
        resolve(active_votes);
    });
}


async function example() {
    const votes = await get_active_votes("howo", "", "");
    console.log(votes);
}

example();