const express = require('express');
const router = express.Router();

// import controller
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { read, update, deleteUser, getAll } = require('../controllers/user');

router.get('/user', requireSignin, read);
router.put('/user/update', requireSignin, update);
router.delete('/user/delete', requireSignin, deleteUser);
router.get('/user/getAll', requireSignin, getAll);
router.put('/admin/update', requireSignin, adminMiddleware, update);

module.exports = router;
