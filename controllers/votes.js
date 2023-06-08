const { Player, Profile, Vote } = require('../models');

async function fetchVotes(req, res) {
  try {
    const {count, rows} = await Vote.findAndCountAll({
      where: { id: req.params.playerId, vote: 1 },
      attributes: ['profileId','vote'],
      
    })  
    const {downCount, downRows} = await Vote.findAndCountAll({
      where: { id: req.params.playerId, vote: 0 },
      attributes: ['profileId','vote'],
      
    }) 
console.log('1111111111111111  ');
    res.status(200).json({
      upvotes: count || 0,
      downvotes: downCount || 0,
      playerId: req.params.playerId
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
    } else {
      await Vote.create({
        profileId,
        playerId,
        vote: 1
      });
    }

    const votes = await fetchVotes(req, res);
    res.json(votes);
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

    if (existingVote && existingVote.vote === 0) {
      return res.status(200).json();
    }

    if (existingVote) {
      existingVote.vote = 0;
      await existingVote.save();
    } else {
      await Vote.create({
        profileId,
        playerId,
        vote: 0
      });
    }

    const votes = await fetchVotes(req, res);
    res.json(votes);
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