const router = require('express').Router()
const votesCtrl = require('../controllers/votes.js')
const middleware = require('../middleware/auth.js')

const { decodeUserFromToken, checkAuth } = middleware

// ========= Protected Routes ========= 
router.use(decodeUserFromToken)
router.get('/:playerId', checkAuth, votesCtrl.getVotesForPlayer)
router.post('/:playerId/upvote', checkAuth, votesCtrl.upvote)
router.post('/:playerId/downvote', checkAuth, votesCtrl.downvote)



module.exports = router