const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

// 인증, 회원가입, 로그인 관련 라우터

const router = express.Router();

// 회원가입
router.post('/join', isNotLoggedIn, async (req, res, next) => { // isNotLoggedIn: 로그인 상태가 아닐 경우 실행
    const { email, nick, password } = req.body; // req.body에 담긴 값들을 변수로 지정
    try {
        const exUser = await User.findOne({ where: { email } }); // email값을 통해 users테이블에서 조회
        if (exUser) { // 이미 가입된 email이 있을 경우
            return res.redirect('/join?error=exist');
        }
        
        // password값을 해시함수로 암호화하여 users 테이블에 저장
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/'); // '/'주소로 연결
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 로컬 로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => { // passport의 local로그인 전략 실행
        if (authError) { // 인증에러 발생시
            console.error(authError);
            return next(authError);
        }
        if (!user) { // users테이블에서 user가 조회되지 않을 시
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.logIn(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
});


// 로그아웃 (로컬)
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut(); // req.user 객체 제거
    req.session.destroy(); // req.session 제거
    res.redirect('/');
});

// 카카오 로그인 전략 실행
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;