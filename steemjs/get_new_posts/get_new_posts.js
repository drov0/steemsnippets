var steem = require('steem');

/**
 * This function will be called when a call to steem api is complete 
 * @callback newPostsCallback
 * @param {Object} err - an object describing any error encountered
 * @param {Array} response - an array of posts
 */

/**
 * Gets the latest posts
 * @param {Object} query - an object specifying which posts to get 
 * @param {string} query.[tag] - the tag for which to get posts
 * @param {string} query.[limit] - the maximmum number of posts to get
 * @param {newPostsCallback} callback - function which will receive the array of posts as a parameter
 */
function getNewPosts(query, callback){
    steem.api.getDiscussionsByCreated(query, function(err, response){
      var result = [];
      if(!err) result = response;
      callback(result);
    });    
}

//example - gets the most recent post in tag 'life' 
getNewPosts({tag:"life", limit:1}, function(latestPost) {
    console.log(latestPost[0].title, latestPost[0].author);
});
