const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
const Coffee = require("./models/coffee.js");
const path = require("path");
const { register } = require("module");

//Connect to MongoDB
const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("You are now connected.");
};
// Path to using CSS file
app.use(express.static(path.join(__dirname, "public")));

//Index Page
app.get("/", async (req, res) => {
  res.render("index.ejs");
});
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

//Contact Page
app.get("/contact", async (req, res) => {
  res.render("contact.ejs");
});

//Route for a new item in the inventory
app.get("/coffee/new", (req, res) => {
  res.render("coffee/new.ejs");
});

//Route for getting inventory items
app.get("/coffee", async (req, res) => {
  const inventory = await Coffee.find();
  res.render("coffee/index.ejs", { coffee: inventory });
});

//Route for posting inventory items
app.post("/coffee", async (req, res) => {
  if (req.body.inStock === "on") {
    req.body.inStock = true;
  } else {
    req.body.inStock = false;
  }
  await Coffee.create(req.body);
  res.redirect("coffee/new");
});

//Route for getting inventory item ID
app.get("/coffee/:coffeeId", async (req, res) => {
    const foundItem = await Coffee.findById(req.params.coffeeId);
    res.render("coffee/show.ejs", { coffee: foundItem });
});

//Route for Deleting an Item
app.delete("/coffee/:coffeeId", async (req, res) => {
    await Coffee.findByIdAndDelete(req.params.coffeeId);
    res.redirect("/coffee");
});

//Route for Editing an Item
app.get("/coffee/:coffeeId/edit", async (req, res) => {
  const foundItem = await Coffee.findById(req.params.coffeeId);
  res.render("coffee/edit.ejs", {
    coffee: foundItem,
  });
});

app.put("/coffee/:coffeeId", async (req, res) => {
  if (req.body.inStock === "on") {
    req.body.inStock = true;
  } else {
    req.body.inStock = false;
  }
  await Coffee.findByIdAndUpdate(req.params.coffeeId, req.body);
  res.redirect(`/coffee/${req.params.coffeeId}`);
});

//Search Route
app.post("/search", async (req, res) => {
  try {
    const query = req.body.search;
    const results = await Coffee.find({
      name: { $regex: query, $options: "i" }
    });
    res.render("coffee/index.ejs", { coffee : results })
  } catch (err) {
    console.error(err);
    res.redirect("/coffee");
  }
});

//Listening on Port 3000
app.listen(3000, () => {
    console.log(`Listening on Port 3000!`);
});

//Connecting to MongoDB
connect();

