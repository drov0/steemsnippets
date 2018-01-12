from steem import Steem

def vote(username, wif, identifier, weight):
    """ Vote for a post
        :param str username: Username of the account voting
        :param str wif: posting key of the account voting
        :param str identifier: Identifier for the post to upvote Takes
                               the form ``@author/permlink``
        :param float weight: Voting weight. Range: -100.0 - +100.0. May
                             not be 0.0
        :param str account: Voter to use for voting. (Optional)

        If ``voter`` is not defines, the ``default_account`` will be taken or
        a ValueError will be raised

        .. code-block:: python

            steempy set default_account <account>
    """
    s = Steem(keys=wif,
              nodes=["https://api.steemit.com", "https://rpc.buildteam.io"])
    s.commit.vote(identifier=identifier, weight=weight, account=username)

#example :

vote("username", "posting key", "@howo/introducting-steemsnippets" , 100)