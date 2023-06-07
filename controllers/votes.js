const { Player, Profile, Vote } = require('../models');

async function getVotesForPlayer(req, res) {
  try {
    const playerId = req.params.playerId;
    const votes = await Vote.findAll({
      where: {
        playerId: playerId
      },
      attributes: ['id', 'upvotes', 'downvotes', 'profileId', 'playerId', 'createdAt', 'updatedAt']
    });
    res.status(200).json(votes);
  } catch (error) {
    console.log(error);
  }
}

async function upvote(playerId, profileId) {
  const existingVote = await Vote.findOne({
    where: {
      playerId: playerId,
      profileId: profileId,
    },
  });

  if (existingVote) {
    if (existingVote.voteType === 'upvote') {
      await existingVote.destroy();
      return { upvotes: -1, downvotes: 0 };
    } else {
      await existingVote.update({ voteType: 'upvote' });
      return { upvotes: 1, downvotes: -1 };
    }
  } else {
    await Vote.create({
      playerId: playerId,
      profileId: profileId,
      voteType: 'upvote',
    });
    return { upvotes: 1, downvotes: 0 };
  }
}

async function downvote(playerId, profileId) {
  const existingVote = await Vote.findOne({
    where: {
      playerId: playerId,
      profileId: profileId,
    },
  });

  if (existingVote) {
    if (existingVote.voteType === 'downvote') {
      await existingVote.destroy();
      return { upvotes: 0, downvotes: -1 };
    } else {
      await existingVote.update({ voteType: 'downvote' });
      return { upvotes: -1, downvotes: 1 };
    }
  } else {
    await Vote.create({
      playerId: playerId,
      profileId: profileId,
      voteType: 'downvote',
    });
    return { upvotes: 0, downvotes: 1 };
  }
}

async function vote(req, res) {
  try {
    const playerId = req.params.playerId;
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    const player = await Player.findOne({ where: { id: playerId } });

    let voteChanges = {};

    if (req.body.voteType === 'upvote') {
      voteChanges = await upvote(playerId, profile.id);
    } else if (req.body.voteType === 'downvote') {
      voteChanges = await downvote(playerId, profile.id);
    }

    player.upvotes += voteChanges.upvotes;
    player.downvotes += voteChanges.downvotes;

    await player.save();
    res.status(200).json(player);
  } catch (error) {
    console.log(error);
  }
}

async function updateVotesForPlayer(req, res) {
  const playerId = req.params.playerId
  const { upvotes, downvotes } = req.body
  const player = await Player.findOne({ 
    where: { id: playerId } })

  player.upvotes = upvotes
  player.downvotes = downvotes
  await player.save()

  return res.status(200).json(player)
}

module.exports = {
  vote,
  getVotesForPlayer,
  downvote,
  upvote,
  updateVotesForPlayer
};