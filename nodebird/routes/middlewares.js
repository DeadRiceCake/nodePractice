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