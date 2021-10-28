const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');

const router = express.Router();

// 페이지 라우터

router.use((req, res, next) => { // 넌적스(프론트)에서 사용할 수 있도록 res.locals객체에 값을 담아줌
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => { // 로그인 상태여야 res.render의 파일이 렌더링됨
    res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
});

// 에인페이지 정보
router.get('/', async (req, res, next) => {
    try {
        const twits = [];
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            }, 
            order: [['createdAt', 'DESC']],
        });
        res.render('main', { // main.html에 posts의 정보를 res.twits에 담아서 전달
            title: 'NodeBird',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 해시태그 정보
router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag; // 쿼리스트링에 해시태그 정보를 담아서 전달받음
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) { // 해시태그가 있으면 해시태그 정보를 posts에 담아줌
            posts = await hashtag.getPosts({ include: [{ model: User }] });
        }

        return res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;