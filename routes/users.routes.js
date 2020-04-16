const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users.controller');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/',
  [
    check('name').not().isEmpty(),
    check('imageUrl').not().isEmpty(),
    check('mobile').isLength({ min: 8 }),
  ],
  usersController.createUser
);

module.exports = router;
