const { Op } = require('sequelize');
const { Player, Profile } = require('../models');
const cloudinary = require('cloudinary').v2

async function createPlayer(req, res) {
  try {
    const profileId = req.user.profile.id
    const profile = await Profile.findOne({ where: { userId: profileId } })
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
    const profileId = req.user.profile.id;
    const profile = await Profile.findOne({ where: { userId: profileId } })
    if (!profile) {
      return res.status(500).json({ err: error })
    }
    const players = await Player.findAll({
      order: [['createdAt', "DESC"]]
    })
    res.status(200).json(players)
  } catch (error) {
    console.log(error)
  }
}

async function search(req, res) {
  try {
    const profileId = req.user.profile.id;
    const profile = await Profile.findOne({ where: { userId: profileId } })
    if (!profile) {
      return res.status(500).json({ err: error })
    }
    const players = await Player.findAll({
      where: { name: { [Op.like]: `${req.params.searchTerm}%` } },
      order: [['createdAt', "DESC"]]
    })
    res.status(200).json(players)
  } catch (error) {
    console.log(error)
  }
}


async function update(req, res) {
  try {
    const playerId = req.params.playerId;
    const profileId = req.user.profile.id
    const profile = await Profile.findOne({ where: { userId: profileId } })
    const player = await Player.findOne({ where: { id: playerId, profileId: profile.id } })

    if (!player) {
      return res.status(404).json({ error: 'Player not found' })
    }
    if (player.profileId === profile.id) {
      await player.update(req.body)
      res.status(200).json(player)
    } else {
      res.status(403).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    console.log(error)
  }
}

async function deletePlayer(req, res) {
  try {
    const profileId = req.user.profile.id
    const playerId = req.params.playerId
    const profile = await Profile.findOne({
      where: { userId: profileId }
    })
    const player = await Player.findOne({
      where: { id: playerId, profileId: profile.id }
    })
    await player.destroy()
    res.status(200).json()
  } catch (error) {
    console.log(error)
  }
}

async function addPlayerPhoto(req, res) {
  try {
    const playerId = req.params.playerId;
    console.log("THIS IS WORKING");
    const imageFile = req.files.photo.path
    const player = await Player.findOne({ where: { id: playerId } })

    const image = await cloudinary.uploader.upload(imageFile)
    console.log(imageFile, "image file");
    console.log(image.url)
    console.log(player);;
    player.photo = image.url

    await player.save()
    console.log(player, "FIND THIS");
    res.status(201).json(player)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

module.exports = {
  createPlayer,
  index,
  update,
  delete: deletePlayer,
  addPlayerPhoto,
  search,
}