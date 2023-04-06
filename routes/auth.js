const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

//register a user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  //validate user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check the user is already in the database
  const emailExist = await User.findOne({ email });
  if (emailExist) return res.status(400).send("Email already exists");

  //has the password
  const salt = await bcrypt.genSalt(10);
  const hadshedPassword = await bcrypt.hash(password, salt);

  //create user
  const user = new User({
    name,
    email,
    password: hadshedPassword,
  });

  try {
    const postUser = await user.save();
    res.status(200).send({ postUser: postUser?._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //validate user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check the email exist
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("Email does not exist!");

  //password is correact
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //jsonwebtoken
  const token = jwt.sign({ _id: user.id }, process.env.SECRET);
  res.header("auth-token", token).send(token);
});
module.exports = router;
