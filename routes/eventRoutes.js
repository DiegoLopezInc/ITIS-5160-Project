// require modules
const express = require('express')
const controller = require('../controllers/eventController')
const { fileUpload } = require('../middlewares/fileUpload')
const { isLoggedIn, isAuthor } = require('../middlewares/auth')
const { validateId } = require('../middlewares/validator')

// set up router
const router = express.Router()

// Public routes
router.get('/', controller.index)

// Protected routes - specific routes first
router.get('/new', isLoggedIn, controller.new)
router.post('/', isLoggedIn, fileUpload, controller.create)

// GET /events/fix-images
router.get('/fix-images', controller.fixAllEventImages);

// Routes with parameters
router.get('/:id', validateId, controller.show)
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit)
router.put('/:id', validateId, isLoggedIn, isAuthor, fileUpload, controller.update)
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete)

// export
module.exports = router
