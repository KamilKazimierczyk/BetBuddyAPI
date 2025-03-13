const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.route('/').get(UserController.getAllUsers).post(UserController.createUser);

router.route('/:id').get(UserController.getUserById).patch(UserController.updateUserById).delete(UserController.deleteUserById);

module.exports = router;