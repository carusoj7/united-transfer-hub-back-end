const { Player, Profile, Vote } = require('../models');

async function fetchVotes(req, res) {
  try {
    const profileId = req.user.profile.id;
    const playerId = req.params.playerId;
    const {count, rows} = await Vote.findAndCountAll({
      where: { playerId, vote: 1 },
      attributes: ['profileId','vote'],
      
    })  
    const downvotes = await Vote.findAndCountAll({
      where: { playerId, vote: -1 },
      attributes: ['profileId','vote'],
      
    }) 
    const existingVote = await Vote.findOne({
      where: { profileId, playerId }
    });
console.log(count, 'upvote');
console.log('1111111111111111  ');
    res.status(200).json({
      upvotes: count,
      downvotes: downvotes.count,
      existingVote
    })
    return 
  } catch (error) {
    console.log(error)
  }
}

async function upvote(req, res) {
  try {
    const profileId = req.user.profile.id;
    const playerId = req.params.playerId;

    const existingVote = await Vote.findOne({
      where: { profileId, playerId }
    });

    console.log(existingVote);

    if (existingVote && existingVote.vote === 1) {
      return res.status(200).json();
    }

    if (existingVote) {
      existingVote.vote = 1;
      await existingVote.save();
      res.json(existingVote)
    } else {
      const vote = await Vote.create({
        profileId,
        playerId,
        vote: 1
      });
      res.json(vote)
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function downvote(req, res) {
  try {
    const profileId = req.user.profile.id;
    const playerId = req.params.playerId;
    console.log(req.user);

    const existingVote = await Vote.findOne({
      where: { profileId, playerId }
    });
    console.log(existingVote);

    if (existingVote && existingVote.vote === -1) {
      return res.status(200).json();
    }

    if (existingVote) {
      existingVote.vote = -1;
      await existingVote.save();
      res.json(existingVote)
    } else {
      const vote = await Vote.create({
        profileId,
        playerId,
        vote: -1
      });
      res.json(vote)
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  fetchVotes,
  upvote,
  downvote
}