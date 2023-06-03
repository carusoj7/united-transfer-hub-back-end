const router = require('express').Router()
const playersCtrl = require('../controllers/players.js')
const middleware = require('../middleware/auth.js')

const { decodeUserFromToken, checkAuth } = middleware

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.post('/', checkAuth, playersCtrl.createPlayer)
router.get('/', checkAuth, playersCtrl.index)
router.get('/:playerId', checkAuth, playersCtrl.show)
router.put('/:playerId', checkAuth, playersCtrl.update)
router.delete('/:playerId', checkAuth, playersCtrl.delete)


module.exports = router