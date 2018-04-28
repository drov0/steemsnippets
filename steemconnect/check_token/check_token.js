const sc2 = require('sc2-sdk');

/**
 * Checks if an access token/username pair is correct
 * @param {String} username - username of the account
 * @param {String} access_token - Access token associated with the account
 @returns {Promise.<Array>} Array with one or two elements. First one is set to True if the access token is correct, or false and the error (aka the reason) will be stored in the second element.
 */
function sc_valid(username, access_token)
{
    return new Promise(resolve => {

        let api = sc2.Initialize({});

        api.setAccessToken(access_token);

        api.me(function (err, res) {
            if (err)
                return resolve([false, err]);

            if (res.name === username)
                return resolve([true]);

            return resolve([true]);
        });
    });
}


//Example
async function example()
{
    const result = await sc_valid("howo", "bad access token")
    if (result[0]) // if the result is true
    {
        console.log("Access token is correct ! ")
    }
    else
    {
        console.log(result[1]);

        /* Should output :
            {   SDKError: sc2-sdk error
                name: 'SDKError',
                error: 'invalid_grant',
                error_description: 'The token has invalid role'
            }
         */
    }
}

example()