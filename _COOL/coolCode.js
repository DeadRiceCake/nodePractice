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
