from steem.account import Account
from steem import Steem
from steem import converter
import operator


# Note : This is fairly slow and an probably be optimized but it can give you a sense of how to do things
acc = Account(
    "acidyo",
    steemd_instance=Steem(
        nodes=["https://api.steemit.com"])
    )

followers = {}

for follower in acc.get_followers():
    print(follower)
    follower_obj = Account(
        follower,
        steemd_instance=Steem(
            nodes=["https://api.steemit.com"])
    )
    total_sp = 0
    sp_vests = float(follower_obj['vesting_shares'][:-6])
    recieved_vests = float(follower_obj['received_vesting_shares'][:-6])
    delegated_vests = float(follower_obj['delegated_vesting_shares'][:-6])
    total_sp = sp_vests + recieved_vests - delegated_vests
    sp = (round(follower_obj.converter.vests_to_sp(total_sp), 3)) # convert vests to steem power
    followers.update({follower: sp})

sorted_followers = sorted(followers.items(), key=operator.itemgetter(1))

for follower in sorted_followers:
    print(follower)
