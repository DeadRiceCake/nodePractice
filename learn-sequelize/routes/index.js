const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.render('sequelize', { users });
        console.log('유저 정보 :', users);
    } catch (err) {
        console.error(err);
        next(err);
     }
});

module.exports = router;