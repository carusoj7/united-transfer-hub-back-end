const { Player, Profile, Vote } = require('../models');

async function fetchVotes(playerId) {
  const votes = await Vote.findAll({
    where: {
      profileId: playerId,
    },
    include: {
      model: Player,
      attributes: ['upvotes', 'downvotes']
    },
  });

  const totalUpvotes = votes.reduce((acc, vote) => acc + vote.upvotes, 0);
  const totalDownvotes = votes.reduce((acc, vote) => acc + vote.downvotes, 0);

  return {
    upvotes: totalUpvotes,
    downvotes: totalDownvotes
  };
}

async function upvote(playerId, profileId) {
  const existingVote = await Vote.findOne({
    where: {
      profileId: playerId,
    },
  });

  if (existingVote) {
    await existingVote.destroy();
    return { upvotes: -1, downvotes: 0 };
  } else {
    await Vote.create({
      playerId: playerId,
      profileId: profileId,
    });
    return { upvotes: 1, downvotes: 0 };
  }
}

async function downvote(playerId, profileId) {
  const existingVote = await Vote.findOne({
    where: {
      profileId: playerId
    },
  });

  if (existingVote) {
    await existingVote.destroy();
    return { upvotes: 0, downvotes: -1 };
  } else {
    await Vote.create({
      playerId: playerId,
      profileId: profileId,
    });
    return { upvotes: 0, downvotes: 1 };
  }
}

module.exports = {
  fetchVotes,
  upvote,
  downvote
};