const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secret = process.env.TOKEN_SECRET;
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username cannot be empty!"],
      minlength: [5, "Username must be at least 5 characters!"],
    },
    fullName: { fName: String, lName: String },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    phone: {
      type: String,
    },
    image: { type: Buffer },
    gender: String,
    email: {
      type: String,
      required: [true, "Email cannot be empty!"],
      unique: [true, "User with this email already exist!"],
      match: [/^\S+@\S+\.\S+$/, "Please provide valid email address!"],
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password cannot be empty!"],
    },
    tokens: [{ token: { type: String, required: true } }],
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      image: user.image,
      isAgent: user.isAgent,
      isAdmin: user.isAdmin,
    },
    secret,
    {
      expiresIn: "1d",
    }
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
