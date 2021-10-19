router
  .route("/tenChannels")
  .all(mAuth.verify)
  .get(async (req, res) => {
    try {
      let baladChannels = await mProfile.tenChannels("발라드");
      console.log(baladChannels[0]);

      res.status(200).json({
        baladCH: baladChannels.map((item) => {
          return {
            thumbnail: `${config.file.endpoint101}/channel/image/thumbnail/${item.thumbnail}`,
            tag: item.main_tag,
            nickname: item.nickname,
            name: emoji.emojify(item.name),
            release: {
              min: parseInt(moment(item.release_date_min).format("YYYY")),
              max: parseInt(moment(item.release_date_max).format("YYYY")),
            },
            nation: item.nation,
            playtime: item.play_time,
          };
        }),
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ code: 0, reason: "bad request" });
    }
  });

// 미션 API======================================================================
router
  .route("/mission")
  .all(mAuth.verify)
  .get(async (req, res) => {
    try {
      let userInfo = await mProfile.getUserInfoMission(req.auth.id);
      let myCH = await mProfile.getMyCH(req.auth.id);
      let myArtist = await mProfile.getMyArtist(req.auth.id);

      userInfo = userInfo[0];
      myCH = myCH;
      myArtist = myArtist;

      console.log("userInfo:", userInfo);
      console.log("myCH:", myCH);
      console.log("myArtist:", myArtist);

      res.status(200).json({
        thumbnail: `${config.file.endpoint101}/channel/image/profile/${userInfo.thumbnail}`,
        nickname: userInfo.nickname,
        follow: {
          following: userInfo.following,
          follower: userInfo.follower,
        },
        myCH: myCH.map((item) => {
          return {
            name: emoji.emojify(item.name),
            thumbnail: `${config.file.endpoint101}/channel/image/thumbnail/${item.thumbnail}`,
            music_cnt: item.music_cnt,
            play_time: item.play_time,
            like_cnt: item.like_cnt,
            main_tag: item.main_tag,
          };
        }),
        artist: myArtist.map((item) => {
          return {
            name: item.name,
            profile: item.image_check
              ? `${config.file.endpoint101}/channel/image/ARTISTS/${item.idx}.jpg`
              : `${Math.floor(Math.random() * 18)}`,
          };
        }),
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ code: 0, reason: "bad request" });
    }
  });

module.exports = router;

//===============================================================
exports.getUserInfoMission = function (userId) {
  const queryString = `
    SELECT
      u.thumbnail,
      u.nickname,
      f.following,
      f.follower,
      (
      SELECT 
        COUNT(*) AS like_cnt 
      FROM 
        channel AS c
        LEFT JOIN 
          user_like_channel AS ulc 
        ON 
          ulc.channel_idx = c.idx
      WHERE 
        c.user_idx = ? 
        AND c.enabled = 1 
        AND ulc.like = 1
      ) AS like_cnt
    FROM
      user AS u
      JOIN 
        (
        SELECT 
          ? AS user_idx,
          COUNT(CASE WHEN user_idx = ? THEN 1 END) AS following,
          COUNT(CASE WHEN follow = ? THEN 1 END) AS follower
        FROM 
          user_follow AS f
        WHERE user_idx = ? OR follow = ?
        ) AS f 
      ON f.user_idx = u.idx
    WHERE
      u.idx = ?;
    `;
  return db.query(queryString, [
    userId,
    userId,
    userId,
    userId,
    userId,
    userId,
    userId,
  ]);
};

exports.getMyCH = function (userId) {
  const queryString = `
    SELECT
      c.idx,
      c.name,
      c.thumbnail,
      COUNT(c.idx) AS music_cnt,
      c.play_time,
      (
      SELECT 
        COUNT(*) AS like_cnt 
      FROM 
        channel AS ch
          LEFT JOIN 
            user_like_channel AS ulc 
          ON ulc.channel_idx = ch.idx
      WHERE 
        ch.idx = c.idx 
        AND 
        c.enabled 
        AND 
        ulc.like = 1
      ) AS like_cnt,
      (
      SELECT 
      t.name 
      FROM 
        tag AS t
        JOIN 
          channel_tag AS ct 
        ON 
          t.idx = ct.tag_idx 
      WHERE 
        ct.channel_idx = c.idx
      ORDER BY 
        ct.main_tag DESC, 
        ct.tag_idx DESC 
      LIMIT 1
      )AS main_tag
    FROM
      channel AS c
      JOIN
        channel_play_list AS cpl
      ON c.idx = cpl.channel_idx
    WHERE
      c.user_idx = ?
    GROUP BY
      c.idx;
    `;
  return db.query(queryString, [userId]);
};

exports.getMyArtist = function (userId, page = 1, max = 10) {
  const queryString = `
    SELECT 
      rma.artist_idx AS idx,
      rma.name,
      rma.image_check
    FROM
      RENEW_meta_artist AS rma
      JOIN
        user_tag AS ut
      ON ut.tag_idx = rma.artist_idx
      AND ut.type = 1
    WHERE ut.user_idx = ?
    LIMIT ?, ?
    `;
  return db.query(queryString, [userId, (page - 1) * max, max]);
};