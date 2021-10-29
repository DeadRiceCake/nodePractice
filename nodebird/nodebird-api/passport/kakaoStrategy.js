const passport = require('passport');
const Kakaostrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

// 카카오 로그인시 사용되는 로그인 전략

module.exports = () => {
    passport.use(new Kakaostrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback', // 카카오 디벨로퍼즈 앱 RedirectURI와 주소가 같아야 함
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' },
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};