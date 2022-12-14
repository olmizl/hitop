const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const cors = require("cors");
const axios = require("axios");
const { allowedNodeEnvironmentFlags } = require("process");
const dotenv = require("dotenv").config();
app.use(cors());

const MongoClient = require("mongodb").MongoClient;
let db = null;
MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  console.log("연결");
  if (err) {
    console.log(err);
  }
  db = client.db("hitop-app");
});

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

const corsOption = {
  origin: "http://127.0.0.1:5500",
  credentials: true,
};

app.set("port", process.env.PORT || 8099);

const PORT = app.get("port");

app.use(express.static(path.join(__dirname, "./public"))); //정적파일 css,js,images등 서비스 해주는 경로 잡아주기
app.use(express.json()); //json을 리턴하려면

app.get("/", (req, res) => {
  // db.collection("recruit")
  //   .find()
  //   .toArray((err, result) => {
  //     res.render("index", { list: result });
  //   });
  res.render("index");
});

app.get("/write", (req, res) => {
  res.render("write");
});

app.get("/inquiry", (req, res) => {
  db.collection("recruit")
    .find()
    .toArray((err, result) => {
      res.render("inquiry", { list: result });
    });
});

app.get("/detail/:no", (req, res) => {
  const no = parseInt(req.params.no);
  db.collection("recruit").findOne({ no: no }, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.render("detail", { title: result.title, date: result.date, desc: result.desc, writer: result.writer });
    }
  });
  // res.render("detail");
});

app.post("/add", (req, res) => {
  db.collection("counter").findOne({ name: "total" }, (err, result) => {
    const total = result.totalPost;
    const title = req.body.title;
    const writer = req.body.writer;
    const date = req.body.date;
    const desc = req.body.desc;
    const insertData = {
      no: total + 1,
      title: title,
      writer: writer,
      date: date,
      desc: desc,
    };
    db.collection("recruit").insertOne(insertData, (err, result) => {
      db.collection("counter").updateOne({ name: "total" }, { $inc: { totalPost: 1 } }, (err, result) => {
        if (err) {
          console.log(err);
        }
        res.send(`<script>alert("작성 되었습니다"); location.href="/inquiry"</script>`);
      });
    });
  });
});

app.get("/introduce", (req, res) => {
  res.render("introduce");
});
app.get("/greeting", (req, res) => {
  res.render("greeting", { title: "인사말" });
});
app.get("/ci", (req, res) => {
  res.render("ci");
});
app.get("/catalog", (req, res) => {
  res.render("catalog");
});
app.get("/history", (req, res) => {
  res.render("history");
});
app.get("/system", (req, res) => {
  res.render("system");
});
app.get("/notice", (req, res) => {
  res.render("notice");
});
app.get("/market", (req, res) => {
  res.render("market");
});
app.get("/location", (req, res) => {
  res.render("location");
});
app.get("/organization", (req, res) => {
  res.render("organization");
});
app.get("/people", (req, res) => {
  res.render("people");
});
app.get("/philosophy", (req, res) => {
  res.render("philosophy");
});
app.get("/projects", (req, res) => {
  res.render("projects");
});
app.get("/recruit", (req, res) => {
  res.render("recruit");
});

app.get("/detail01", (req, res) => {
  res.render("recruitdetail01");
});
app.get("/detail02", (req, res) => {
  res.render("recruitdetail02");
});
app.get("/detail03", (req, res) => {
  res.render("recruitdetail03");
});
app.get("/detail04", (req, res) => {
  res.render("recruitdetail04");
});
app.get("/detail05", (req, res) => {
  res.render("recruitdetail05");
});
// app.get("/inquiry", (req, res) => {
//   res.render("inquiry");
// });
app.get("/gallery01", (req, res) => {
  res.render("gallery01");
});
app.get("/certification01", (req, res) => {
  res.render("certification01");
});
app.get("/business0101", (req, res) => {
  res.render("business0101");
});
app.get("/business0201", (req, res) => {
  res.render("business0201");
});
app.get("/business0301", (req, res) => {
  res.render("business0301");
});
app.get("/business0401", (req, res) => {
  res.render("business0401");
});
// app.get("/list", (req, res) => {
//   // res.send("list입니다");
//   // res.header("Access-Control-Allow-Origin", "*")
//   res.json([
//     { title: "타이틀 01", contents: "내용" },
//     { title: "타이틀 01", contents: "내용2" },
//     { title: "타이틀 01", contents: "내용3" },
//   ]);
// });

// app.get("/naver", (req, res) => {
//   //여기서 검색결과를 받아서 리턴을 해야한다 , ajax를 naver.
//   //axios는 promise를 리턴
//   console.log(req.query);
//   const queryTxt = encodeURIComponent(req.query.movieTitle);
//   axios({ url: `https://openapi.naver.com/v1/search/movie.json?query=${queryTxt}`, headers: { "X-Naver-Client-Id": "BkFyr1H70ohFIy1FhLfr", "X-Naver-Client-Secret": "5fG_uUcTsR" } }).then(function (
//     response
//   ) {
//     res.json(response.data);
//   });
// });

//404 not ( routing 안될 때) 오류 는 마지막에 쓰기
app.use((req, res, next) => {
  res.status(404).render("404");
});

app.use((err, req, res, next) => {
  res.status(500).render("error", { msg: "알 수 없는 오류가 발생했습니다." });
});

app.listen(PORT, () => {
  console.log(`${PORT}에서 서버 대기중`);
});
