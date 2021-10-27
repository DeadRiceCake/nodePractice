const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 페이지 라우터

router.use((req, res, next) => { // 넌적스(프론트)에서 사용할 수 있도록 res.locals객체에 값을 담아줌
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => { // 로그인 상태여야 res.render의 파일이 렌더링됨
    res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main', {
        title: 'NodeBird',
        twits,
    });
});

module.exports = router;