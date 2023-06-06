const { Player, Profile, Vote } = require('../models')

async function vote(req, res) {
  try {
    const playerId = req.params.playerId
    const profile = await Profile.findOne({ where: { userId: req.user.id } })
    const player = await Player.findOne({ where: { id: playerId } })

    const existingVote = await Vote.findOne({
      where: {
        playerId: playerId,
        profileId: profile.id
      }
    })

    if (req.body.voteType === 'upvote') {
      if (existingVote) {
        if (existingVote.voteType === 'upvote') {
          await existingVote.destroy()
          player.upvotes -= 1
        } else {
          
          await existingVote.update({ voteType: 'upvote' })
          player.upvotes += 1
          player.downvotes -= 1
        }
      } else {
        await Vote.create({
          playerId: playerId,
          profileId: profile.id,
          voteType: 'upvote'
        });
        player.upvotes += 1
      }
    } else if (req.body.voteType === 'downvote') {
      if (existingVote) {
        if (existingVote.voteType === 'downvote') {
          await existingVote.destroy()
          player.downvotes -= 1
        } else {
          await existingVote.update({ voteType: 'downvote' });
          player.downvotes += 1
          player.upvotes -= 1
        }
      } else {
        await Vote.create({
          playerId: playerId,
          profileId: profile.id,
          voteType: 'downvote'
        });
        player.downvotes += 1
      }
    }

    await player.save()
    res.status(200).json(player)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  vote
}