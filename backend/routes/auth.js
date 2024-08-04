import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import { genSalt, hash } from "bcrypt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fetchuser from "../middleware/fetchuser.js";
const JWT_SECRET = "kushangisagoodboy$$";

const router = express.Router();

// ROUTE:1  Create a User using: POST "/api/auth/createuser". Login not required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether user with this email already exist
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry :( a user with this email alerdy exits" });
      }
      // Create a new user
      const salt = await genSalt(10);
      const secPassword = await hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });

      const data = {
        user: {
          id: user.id,
          name: user.name,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);

      // res.json(user);

      res.json({ authToken });
    } 
    // Catch Error
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE:2  Authenticate user using: POST "/api/auth/login". Login not required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructring
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      // comparing password with database
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
          name: user.name,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } 
    // Catch Error
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE:3  get loggedin user details using: POST "/api/auth/getuser". Login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } 
  // Catch Error
    catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
