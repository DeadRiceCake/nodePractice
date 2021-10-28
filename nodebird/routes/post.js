const express = require('express');
const multer =  require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// uploads 폴더 읽기(없으면 생성)
try {
    if (!fs.readFileSync('uploads')) {
        fs.mkdirSync('uploads');
    }
    fs.readFileSync('uploads'); 
} catch (error) {
    console.error(error);
}

// 이미지 파일 업로드
const upload = multer({
    storage: multer.diskStorage({ // 서버 디스크 스토리지에 저장(권장하지는 않음, 요즘 대세는 AWS S3같은 클라우드 저장소에 저장)
        destination(req, file, cb) { // 저장 경로
            cb(null, 'uploads/');
        },
        filename(req, file, cb) { // 저장할 파일 명
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지파일 업로드 라우터
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` }); // 이미지파일의 경로를 json데이터로 반환
});

// 업로드한 이미지파일 정보 DB에 저장 및 해시태그정보 저장
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => { // 멀티미디어파일이 아닌 단순 경로명을 저장하기 때문에 .none()을 사용
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]+/g); // 작성한 글에서 해시태그 찾아내기
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({ // findOrCreate: DB에 값이 있으면 select하고 없으면 insert
                        where: { title: tag.slice(1).toLowerCase() }, // #를 없애고(slice) 소문자로 변환
                    })
                }),
            );
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;