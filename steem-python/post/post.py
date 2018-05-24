from steem import Steem

""" Create a new post.
        If this post is intended as a reply/getContent, `reply_identifier` needs to be set with the identifier of the parent
        post/getContent (eg. `@author/permlink`).

        Optionally you can also set json_metadata, comment_options and upvote the newly created post as an author.

        Setting category, tags or community will override the values provided in json_metadata and/or comment_options
        where appropriate.

        Args:
            username (str) : Username of the account posting
            wif (str) : posting key of the account posting
            title (str): Title of the post
            body (str): Body of the post/getContent
            author (str): Account are you posting from
            permlink (str): Manually set the permlink (defaults to None).
                If left empty, it will be derived from title automatically.
            reply_identifier (str): Identifier of the parent post/getContent (only if this post is a reply/getContent).
            json_metadata (str, dict): JSON meta object that can be attached to the post.
            comment_options (str, dict): JSON options object that can be attached to the post.
                Example::

                    comment_options = {
                        'max_accepted_payout': '1000000.000 SBD',
                        'percent_steem_dollars': 10000,
                        'allow_votes': True,
                        'allow_curation_rewards': True,
                        'extensions': [[0, {
                            'beneficiaries': [
                                {'account': 'account1', 'weight': 5000},
                                {'account': 'account2', 'weight': 5000},
                            ]}
                        ]]
                    }

            community (str): (Optional) Name of the community we are posting into. This will also override the
                community specified in `json_metadata`.
            tags (str, list): (Optional) A list of tags (5 max) to go with the post. This will also override the
                tags specified in `json_metadata`. The first tag will be used as a 'category'.
                If provided as a string, it should be space separated.
            beneficiaries (list of dicts): (Optional) A list of beneficiaries for posting reward distribution.
                This argument overrides beneficiaries as specified in `comment_options`.

                For example, if we would like to split rewards between account1 and account2::

                    beneficiaries = [
                        {'account': 'account1', 'weight': 5000},
                        {'account': 'account2', 'weight': 5000}
                    ]

            self_vote (bool): (Optional) Upvote the post as author, right after posting.
        """
def post(username, wif, title, body, permlink=None, reply_identifier=None, json_metadata=None, comment_options=None, community=None, tags=None, beneficiaries=None, self_vote=False):
    s = Steem(keys=wif,
                  nodes=["https://api.steemit.com", "https://rpc.buildteam.io"])
    s.commit.post(title, body, username, permlink, reply_identifier, json_metadata, comment_options, community, tags, beneficiaries, self_vote)

# example :

post("username", "posting key" ,title="Python Test", body="blank", tags=['spam','test'], self_vote=False)
