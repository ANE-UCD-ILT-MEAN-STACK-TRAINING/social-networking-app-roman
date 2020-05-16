const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Post = require("./model/post");
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");
const path = require("path");

mongoose
  .connect(
    //"mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false"
    //"mongodb+srv://roman:RfI1pMF0WpFscYtK@cluster0-hxf5l.mongodb.net/test?retryWrites=true&w=majority"
    "mongodb+srv://roman:RfI1pMF0WpFscYtK@cluster0-hxf5l.mongodb.net/MyPosts?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

// Lets attach the body-parser middleware
// bodyParser.json() -> this will tell only to process json type data from the request body
app.use(bodyParser.json());
//another example showing body-parser can process other types of body other than json
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id,
    });
  });

  console.log(post);
  res.status(201).json({
    message: "Post added successfully",
  });
});

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "fadf12421l",
      title: "First server-side post",
      content: "This is coming from the server",
    },
    {
      id: "ksajflaj132",
      title: "Second server-side post",
      content: "This is coming from the server!",
    },
  ];
  res.status(200).json({
    message: "Posts fetched succesfully!",
    posts: posts,
  });
});

app.use("/api/posts", postRoutes);

module.exports = app;
app.use(postRoutes);

app.use("/images", express.static(path.join("backend/images")));
