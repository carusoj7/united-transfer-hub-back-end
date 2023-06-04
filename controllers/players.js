const { Player, Profile, Vote } = require('../models')

async function createPlayer(req, res) {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } })
    if (!profile) {
      return res.status(500).json({ err: error })
    }
    const player = await Player.create({
      ...req.body,
      profileId: profile.id
    })
    res.status(200).json(player)
  } catch (error) {
    console.log(error)
  }
}

async function index(req, res) {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } })
    if (!profile) {
      return res.status(500).json({ err: error })
    }
    const players = await Player.findAll({
    order:[[ 'createdAt', "DESC"]]
    })
    res.status(200).json(players)
  } catch (error) {
    console.log(error)
  }
}

async function show(req, res) {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } })
    if (!profile) {
      return res.status(500).json({ err: error })
    }
    const playerId = req.params.playerId
    const player = await Player.findOne({
      where: {id: playerId, profileId: profile.id}
    })
    res.status(200).json(player)
  } catch (error) {
    console.log(error)
  }
}

async function update(req, res) {
  try {
    const playerId = req.params.playerId;
    const profile = await Profile.findOne({
      where: { userId: req.user.id }
    });
    const player = await Player.findOne({
      where: { id: playerId }
    });

    const existingUpVote = await Vote.findOne({
      where: {
        playerId: playerId,
        profileId: profile.id
      }
    });

    if (existingUpVote) {
      if (existingUpVote.upvotes > 0) {
        await existingUpVote.decrement('upvotes');
        player.upvotes -= 1;
      }
    } else {
      await Vote.create({
        playerId: playerId, // Add the playerId when creating a new vote
        profileId: profile.id
      });
      player.upvotes += 1;
    }

    const existingDownVote = await Vote.findOne({
      where: {
        playerId: playerId,
        profileId: profile.id
      }
    });

    if (existingDownVote) {
      if (existingDownVote.downvotes > 0) {
        await existingDownVote.decrement('downvotes');
        player.downvotes -= 1;
      }
    } else {
      await Vote.create({
        playerId: playerId, // Add the playerId when creating a new vote
        profileId: profile.id
      });
      player.downvotes += 1;
    }

    await player.save();
    await player.update(req.body);
    res.status(200).json(player);
  } catch (error) {
    console.log(error);
  }
}

async function deletePlayer(req, res) {
  try {
    const playerId = req.params.playerId
    const profile = await Profile.findOne({
      where: { userId: req.user.id }
    })
    const player = await Player.findOne({
      where: { id: playerId, profileId: profile.id}
    })
    await player.destroy()
    res.status(200).json()
  } catch (error) {
    console.log(error)
  }
}



module.exports = {
  createPlayer,
  index,
  show,
  update,
  delete: deletePlayer
}