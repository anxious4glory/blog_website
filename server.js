import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

// Initialize App
const app = express();
const port = process.env.PORT || 3000; // Use Render's dynamic port

// In-memory data store (from index.js)
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field...",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future...",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life...",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];
let lastId = 3;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

// --------------- API ROUTES ------------------
// GET all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// GET a single post
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// Create new post
app.post("/posts", (req, res) => {
  const newId = ++lastId;
  const post = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  };
  posts.push(post);
  res.status(201).json(post);
});

// Update post
app.patch("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;
  if (req.body.author) post.author = req.body.author;

  res.json(post);
});

// Delete post
app.delete("/posts/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts.splice(index, 1);
  res.json({ message: "Post deleted" });
});

// --------------- FRONTEND ROUTES ------------------
// Render home page
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

// Render new post form
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

// Render edit post form
app.get("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  res.render("modify.ejs", {
    heading: "Edit Post",
    submit: "Update Post",
    post,
  });
});

// Handle POST form submission for new
app.post("/api/posts", (req, res) => {
  const newId = ++lastId;
  const post = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  };
  posts.push(post);
  res.redirect("/");
});

// Handle POST for updating
app.post("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (post) {
    post.title = req.body.title;
    post.content = req.body.content;
    post.author = req.body.author;
  }
  res.redirect("/");
});

// Delete via frontend
app.get("/api/posts/delete/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (index !== -1) posts.splice(index, 1);
  res.redirect("/");
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
