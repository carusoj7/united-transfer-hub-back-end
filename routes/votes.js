const router = require('express').Router()
const votesCtrl = require('../controllers/votes.js')
const middleware = require('../middleware/auth.js')

const { decodeUserFromToken, checkAuth } = middleware

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.get('/:playerId/votes', checkAuth, votesCtrl.fetchVotes)
router.post('/:playerId/upvote', checkAuth, votesCtrl.upvote)
router.post('/:playerId/downvote', checkAuth, votesCtrl.downvote)

module.exports = router