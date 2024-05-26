const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course, User } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;

  const adminExist = await Admin.findOne({
    username: username,
    password: password,
  });
  if (adminExist) {
    return res.status(403).send("Username already exists");
  }
  await Admin.create({
    username: username,
    password: password,
  });

  res.json({
    message: "Admin created successfully",
  });
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;
  const user = await Admin.findOne({
    username: username,
  });
  if (user) {
    const token = jwt.sign(
      { username: username, password: password },
      process.env.JWT_SECRET
    );
    return res.json({
      token,
    });
  } else {
    res.status(411).json({
      message: "Incorrect email and password",
    });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const { title, description, price, imageLink } = req.body;
  const newCourses = await Course.create({
    title,
    description,
    price,
    imageLink,
  });
  res.json({
    message: "Course created successfully",
    courseId: newCourses._id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  const courses = await Course.find({});
  res.json({
    courses: courses,
  });
});

module.exports = router;
