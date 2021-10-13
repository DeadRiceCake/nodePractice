-- 유저 아이디값 기반으로 모든 분리된 테이블들에서 이메일값 가져오기
SELECT 
      u.idx,
      u.nickname,
      u.thumbnail,
      CONCAT(
        IFNULL(CONCAT(g.email,","), ""),
        IFNULL(CONCAT(k.email,","), ""),
        IFNULL(CONCAT(ap.email,","), ""),
        IFNULL(CONCAT(ac.email,","), "")
        )
      AS email
    FROM 
      user AS u
      LEFT JOIN 
        account AS ac
        ON u.idx = ac.user_idx
      LEFT JOIN 
        google AS g
        ON u.idx = g.user_idx
      LEFT JOIN 
        kakao AS k
        ON u.idx = k.user_idx
      Left JOIN 
        apple AS ap
        ON u.idx = ap.user_idx
    WHERE
      u.idx = ?;




-- 장르를 지정하여 랜덤으로 10개의 채널 정보 가져오기
SELECT 
	ct.idx,
  ct.channel_idx,
  ct.tag_idx,
  ct.created_at,
  c.thumbnail,
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
	)AS main_tag,
  u.nickname,
  c.name,
  cnr.release_date_min,
  cnr.release_date_max,
  cnr.nation,
  c.play_time
FROM 
	channel_tag AS ct
    LEFT JOIN 
		channel AS c
      ON ct.channel_idx = c.idx
    LEFT JOIN
      tag AS t
        ON ct.tag_idx = t.idx
    LEFT JOIN
      user AS u
        ON c.user_idx = u.idx
    LEFT JOIN
      channel_nation_release_date AS cnr
        ON ct.channel_idx = cnr.channel_idx
WHERE 
	t.name = '발라드'
ORDER BY
	rand()
LIMIT 10;