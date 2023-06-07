const { Player, Profile } = require('../models');

async function createPlayer(req, res) {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } })
    if (!profile) {
      return res.status(500).json({ err: error })
    }
    const { id, ...playerData } = req.body
    const player = await Player.create({
      ...playerData,
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
    const playerId = parseInt(req.params.playerId)
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
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    const player = await Player.findOne({ where: { id: playerId, profileId: profile.id } });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    if (player.profileId === profile.id) {
      await player.update(req.body);
      res.status(200).json(player);
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
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

async function fetchVotes(playerId) {
  try {
    const player = await Player.findOne({
      where: { id: playerId },
      attributes: ['upvotes', 'downvotes'],
    });

    if (!player) {
      return { upvotes: 0, downvotes: 0 };
    }

    return {
      upvotes: player.upvotes || 0,
      downvotes: player.downvotes || 0,
    };
  } catch (error) {
    console.log(error);
    return { upvotes: 0, downvotes: 0 };
  }
}

async function upvote(playerId, profileId) {
  try {
    const player = await Player.findOne({ where: { id: playerId } });

    if (!player) {
      return { upvotes: 0, downvotes: 0 };
    }

    if (player.profileId === profileId) {
      await player.increment('upvotes');
      return { upvotes: player.upvotes + 1, downvotes: player.downvotes };
    }

    return { upvotes: player.upvotes, downvotes: player.downvotes };
  } catch (error) {
    console.log(error);
    return { upvotes: 0, downvotes: 0 };
  }
}

async function downvote(playerId, profileId) {
  try {
    const player = await Player.findOne({ where: { id: playerId } });

    if (!player) {
      return { upvotes: 0, downvotes: 0 };
    }

    if (player.profileId === profileId) {
      await player.increment('downvotes');
      return { upvotes: player.upvotes, downvotes: player.downvotes + 1 };
    }

    return { upvotes: player.upvotes, downvotes: player.downvotes };
  } catch (error) {
    console.log(error);
    return { upvotes: 0, downvotes: 0 };
  }
}




module.exports = {
  createPlayer,
  index,
  show,
  update,
  delete: deletePlayer,
  fetchVotes,
  upvote,
  downvote
}