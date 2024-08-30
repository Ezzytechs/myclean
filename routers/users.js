const express = require("express");
const router = express.Router();
const { User } = require("../models/users");
const bcrypt = require("bcryptjs");
const adminOnly = require("../utils/auth/admin");
const auth = require("../utils/auth/auth");
// const secret = process.env.TOKEN_SECRET;
const multer = require("multer");

const upload = multer({
  limit: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("File must be a image"));
    }
    cb(undefined, true);
  },
});

router.get("/", async (req, res) => {
  console.log(req.ip);

  let queryData = { ...req.query } || {};
  // const key = Object.keys(req.query)[0];
  // const value = Object.values(req.query)[0];
  // const query = { [key]: value === "true" ? true : false };

  try {
    const users = await User.find({ ...queryData }).select(
      "username email isAdmin isAgent phone"
    );
    if (!users || users.length < 1) {
      return res.status(400).json({ message: "No User Found!" });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Check Profile
router.get("/:id", auth, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Please enter valid id" });
    }
    const user = await User.findOne({ _id: req.params.id }).select(
      "-password -image -role -_id -updatedAt -tokens"
    );

    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

//my profile
router.get("/profile/me", auth, async (req, res) => {
  try {
    const userID = req.user.userId;
    const user = await User.findById(userID).select(
      "-password -image -isAdmin -role -tokens"
    );

    if (user.length < 1) {
      return res.status(400).json({ message: "User Not Found!" });
    }
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { lName, fName, street, password, city, state, postalCode, country } =
      req.body;
    const rule =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&amp;])[A-Za-z\d@$!%*?&amp;]{6,}$/;
    if (!rule.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one digit and one special character from set @$!%*?&",
      });
    }
    const userObj = new User({
      ...req.body,
      email: req.body.email.toLowerCase(),
      address: { street, city, state, postalCode, country },
      fullName: { lName, fName },
      password,
      password: bcrypt.hashSync(password, 10),
      isAdmin: false,
      isAgent: false,
    });
    const user = await userObj.save();
    const token = await user.generateAuthToken();
    return res.status(201).json({ message: "Success", token: token });
  } catch (err) {
    if (err.code === 11000) {
      const fieldName = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        message: `User with ${fieldName} already exists!`,
      });
    }
    if (err.name === "ValidationError") {
      const customMessage = Object.values(err.errors).map(
        (error) => error.message
      );
      return res.status(400).json({ message: customMessage[0] });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = await user.generateAuthToken();
      return res.status(200).json({ token: token, success: true });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

//update profile
router.put(
  "/editprofile/:id",
  upload.single("avatar"),
  auth,
  async (req, res) => {
    try {
      if (req.body.password) {
        return res.status(400).json({ message: "Forbidden!" });
      }
      const id = req.user.isAdmin ? req.params.id : req.user.userId;
      const { lName, fName, street, city, state, postalCode, country } =
        req.body;
      const user = await User.findByIdAndUpdate(
        id,
        {
          ...req.body,
          isAdmin: req.user.isAdmin ? req.body.isAdmin : req.user.isAdmin,
          address: { street, city, state, postalCode, country },
          fullName: { lName, fName },
        },
        { new: true }
      ).select("-password -image -tokens -role");
      if (!user) {
        return res.status(400).json("No user found");
      }
      res.status(200).json(user);
    } catch (err) {
      if (err.code === 11000) {
        const fieldName = Object.keys(err.keyValue)[0];
        return res.status(400).json({
          message: `User with ${fieldName}: ${req.body.email} already exists!`,
        });
      }
      if (err.name === "ValidationError") {
        const customMessage = Object.values(err.errors).map(
          (error) => error.message
        );
        return res.status(400).json({ error: customMessage[0] });
      }
      res.status(500).send("Something Went Wrong");
    }
  }
);

router.get("/get/statistics", auth, adminOnly, async (req, res) => {
  try {
    const all = await User.countDocuments();

    const totalAdmin = await User.countDocuments({ isAdmin: true });

    if (!all || !totalAdmin) {
      return res.status(400).json("Unable to count users");
    }
    return res.json({
      totalUsers: all,
      admins: totalAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong");
  }
});

router.put("/togglefeatures/:id", auth, adminOnly, async (req, res) => {
  try {
    const { toggle: fieldName } = req.query;
    // const authority = await User.findById(req.user.userId).select("role");
    // if (authority.role !== secret) {
    //   return res.status(400).json({ Message: "Unauthorized Person!" });
    // }
    const fieldStatus = await User.findById(req.params.id).select(fieldName);

    if (fieldStatus) {
      const newStatus = await User.findByIdAndUpdate(
        req.params.id,
        {
          [fieldName]: !fieldStatus[fieldName],
        },
        { new: true }
      );
      if (!newStatus) {
        return res
          .status(400)
          .json({ success: false, message: "Unable to make admin" });
      }
      return res.status(200).json(newStatus);
    }
    res.status(400).json({ message: "Forbidden!" });
  } catch (error) {
    return res.status(500).json("Something went wrong ");
  }
});

router.post(`/user/logout`, auth, async (req, res) => {
  try {
    req.mainUser.tokens = req.mainUser.tokens.filter(
      (tokenCode) => tokenCode.token !== req.token
    );
    await req.mainUser.save();
    res.status(200).json({ success: true, message: "Success" });
  } catch (error) {
    res.status(400).send("Failed");
  }
});

router.post(`/user/logoutall`, auth, async (req, res) => {
  try {
    req.mainUser.tokens = [];
    await req.mainUser.save();
    res.json({ message: "Success" });
  } catch (error) {
    res.status(400).send({ message: "Failed" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.userId === req.params.id || req.user.isAdmin) {
      const Removeduser = await User.findByIdAndDelete(req.params.id);

      if (!Removeduser) {
        return res
          .status(400)
          .json({ success: false, message: "User Not Found!" });
      }

      return res.status(200).json({ success: true, message: "User Removed!" });
    }
    return res.status(400).json({ message: "Forbidden!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
