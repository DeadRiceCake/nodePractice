const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    // serializeUser: 로그인시 실행되며 req.session 객체에 어떤 데이터를 저장할지 정하는 메서드
    passport.serializeUser((user, done) => { // user: 사용자 정보
        done(null, user.id); // done 1번째 인수: 에러 발생시 사용 // 2번째 인수: 저장하고싶은 데이터 저장
    });

    // deserializeUser: 매 요청시 실행, passport.session 미들웨어가 본 메서드를 호출, serializeUser의 done 2번째 인수로 넣은 데이터가 deserialize의 2번째 인수가 됨.
    //                  세션에 저장된 아이디를 불러와 DB에서 조회함으로써 로그인 여부 확인
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
    kakao();
};