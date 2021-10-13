const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const indexRouter = require("./routes"); // route폴더에 있는 라우터 불러오기
const userRouter = require("./routes/user");
const app = express();
app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
// static : 정적 파일 제공(css, js, 이미지파일 등을 public폴더에 넣으면 브라우저에서 접근 가능)
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);

app.use("/", indexRouter); // route폴더의 라우터 사용
app.use("/user", userRouter);

// 에러처리 코드
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

app.use((req, res, next) => {
  console.log("모든 요청에 다 실행됩니다.");
  next();
});
app.get(
  "/",
  (req, res, next) => {
    console.log("GET / 요청에만 실행됩니다.");
    next();
  },
  (req, res) => {
    throw new Error("에러는 에러 처리 미들웨어로 갑니다.");
  }
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

// app.get("/", (req, res) => {
//   // res.send("Hello, Express");
//   res.sendFile(path.join(__dirname, "/index.html"));
// });

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
