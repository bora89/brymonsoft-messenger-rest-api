const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middlewares/check-auth');

const messagesController = require('../controllers/messages.controller');

const router = express.Router();

router.use(checkAuth);

router.get('/', messagesController.getMessages);

router.post(
  '/',
  [
    check('text').not().isEmpty(),
    check('date').not().isEmpty(),
    check('recipientId').not().isEmpty(),
  ],
  messagesController.createMessage
);

module.exports = router;
