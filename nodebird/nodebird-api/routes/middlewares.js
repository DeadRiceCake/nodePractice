const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

// 로그인 여부(접근 권한 제어)를 확인해주는 미들웨어

// 로그인이 된 상태
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // .isAuthenticated(): 로그인중이면 true, 로그아웃상태면 false
        next(); // 로그인 상태여야만 다음 라우터로 진행 가능
    } else {
        res.status(403).send('로그인 필요');
    }
};

// 로그인이 안된 상태
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};

exports.verifyToken = (req, res, next) => {
    try {
        // 요청 헤더에 저장된 토큰 사용, jwt.verify(토큰, 비밀키) 메서드로 토큰 검증
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') { // 유효기간 초과
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.',
        });
    }
};

exports.apiLimiter = new RateLimit({
    windowMs: 60 * 1000, // 1분
    max: 10,
    handler(req, res) {
        res.status(this.statusCode).json({
            code: this.statusCode, // 기본값 429
            message: '1분에 한 번만 요청할 수 있습니다.',
        });
    },
});

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.'
    });
};