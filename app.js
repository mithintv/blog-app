// initializing node modules
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

// initializing custom modules
const content = require(__dirname + "/template.js");

// using all modules
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

// express-specific methods
app.set("view engine", "ejs");
app.use(express.static("public"));

// data
const postArray = [];

// get routes
app.get("/", urlencodedParser, (req, res) => {
  res.render("home", {
    homeContent: content.homeStartingContent,
    postContent: postArray,
    // exporting lodash into home.ejs
    _: _
  });
});

app.get("/about", urlencodedParser, (req, res) => {
  res.render("about", {
    aboutContent: content.aboutStartingContent
  });
});

app.get("/contact", urlencodedParser, (req, res) => {
  res.render("contact", {
    contactContent: content.contactStartingContent
  });
});

app.get("/compose", urlencodedParser, (req, res) => {
  res.render("compose");
});

app.get("/posts/:postID", urlencodedParser, (req, res) => {
  let index = null;
  const match = postArray.some(post => {
    if (_.kebabCase(post.title) === _.kebabCase(req.params.postID)) {
      index = postArray.indexOf(post);
      return true;
    }
  });
  if (match) {
    res.render("post", {
      postTitle: postArray[index].title,
      postBody: postArray[index].post,
    });
  }
});


// post routes
app.post("/compose", urlencodedParser, (req, res) => {
  let newPost = {
    title: req.body.newTitle,
    post: req.body.newPost
  };
  postArray.push(newPost);
  res.redirect("/");
});


// server 
app.listen(3000, () => {
  console.log("Server started on port 3000");
});