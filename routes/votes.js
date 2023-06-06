const router = require('express').Router()
const votesCtrl = require('../controllers/votes.js')
const middleware = require('../middleware/auth.js')

const { decodeUserFromToken, checkAuth } = middleware

// ========= Protected Routes ========= 
router.use(decodeUserFromToken)
router.post('/:playerId/vote', checkAuth, votesCtrl.vote)



module.exports = router