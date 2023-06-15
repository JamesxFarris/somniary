const router = require("express").Router();
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { User, Dream, DreamTags, Tags} = require("../models");

const withAuth = require("../utils/auth");

// Get request /login
router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");

    return;
  }

  res.render("login");
});

// GET request /   gets the home page if user is logged in
router.get("/", withAuth, async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ["password"] },
      where:{username: req.session.username},
      // order: [["name", "ASC"]],
    });
    console.log(req.session.user_id);
    const dreamData = await Dream.findAll({
      where: { user_id: req.session.user_id },
      include: {
        model: Tags,
        //through: { DreamTags } 
        through: { attributes: [] }
      }
    });
    const user = userData.map((project) => project.get({ plain: true }));
    //const dreams = dreamData.get({ plain: true });
    console.log(dreamData);
    const dreams = dreamData.map((dream) => dream.toJSON());
    let randomIndex= Math.floor(Math.random() * dreamData.length);
    let randomDream = dreams[randomIndex];
    console.log(randomIndex);
    console.log(userData);
    console.log(user);
    console.log(dreams);
    //console.log(dreams.tags);
    res.render("home", {
      user,
      dreams,
      randomIndex,
      randomDream,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET request /signup brings user to signup
router.get("/signup", (req, res) => {
  res.render("signup");
});

// GET request /settings navigates to profile settings page
router.get("/profilesettings", function (req, res) {
  res.render("profilesettings");
});

// GET request /about
router.get("/about", function (req, res) {
  res.render("about");
});

// GET request /journal brings user to all their dreams
router.get("/journal", async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ["password"] },
      where:{username: req.session.username},
      // order: [["name", "ASC"]],
    });
    console.log(req.session.user_id);
    const dreamData = await Dream.findAll({
      where: { user_id: req.session.user_id },
      include: {
        model: Tags,
        //through: { DreamTags } 
        through: { attributes: [] }
      }
    });
    const user = userData.map((project) => project.get({ plain: true }));
    //const dreams = dreamData.get({ plain: true });
    console.log(dreamData);
    const dreams = dreamData.map((dream) => dream.toJSON());
    console.log(userData);
    console.log(user);
    console.log(dreams);
    //console.log(dreams.tags);
    res.render("journal", {
      user,
      dreams,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET request /dreamlog create a new dream
router.get("/dreamlog", function (req, res) {
  res.render("dreamlog");
});

// GET request /calendar shows dreams sorted by date
router.get("/calendar", function (req, res) {
  res.render("calendar");
});

module.exports = router;
