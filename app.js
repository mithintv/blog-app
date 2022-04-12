// initializing node modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

// initializing custom modules
const content = require(__dirname + "/template.js");

// using all modules
const app = express();
const { Schema } = mongoose;

// express-specific methods
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// initializing mongodb
mongoose.connect("mongodb://localhost:27017/blogDB");

// schema
const postSchema = new Schema({
  title: String,
  body: String,
  date: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);

// all routes
app.get("/", (req, res) => {
  Post.find((err, posts) => {
    if (err) console.log(err);
    else {
      res.render("home", {
        homeContent: content.homeStartingContent,
        postContent: posts,
        // exporting lodash into home.ejs
        _: _
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: content.aboutStartingContent
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent: content.contactStartingContent
  });
});

app.route("/compose")
  .get((req, res) => {
    res.render("compose");
  })
  .post((req, res) => {
    let newPost = new Post({
      title: req.body.newTitle,
      body: req.body.newPost
    });
    newPost.save((err) => {
      if (err) console.log(err);
      else res.redirect("/");
    });
  });

app.get("/posts/:postID", (req, res) => {
  Post.findById(req.params.postID, (err, post) => {
    if (err) console.log(err);
    else {
      res.render("post", {
        postTitle: post.title,
        postBody: post.body,
      });
    }
  });
});


// server 
app.listen(3000, () => {
  console.log("Server started on port 3000");
});