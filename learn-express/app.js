const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const nunjucks = require("nunjucks");

dotenv.config();
const indexRouter = require("./routes"); // route폴더에 있는 라우터 불러오기
const userRouter = require("./routes/user");
const app = express();
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

nunjucks.configure("views", {
  express: app,
  watch: true,
});

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
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// app.get("/", (req, res) => {
//   // res.send("Hello, Express");
//   res.sendFile(path.join(__dirname, "/index.html"));
// });

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
