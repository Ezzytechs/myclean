const request = require("supertest");
const app = require("../app");
const { User } = require("../models/users");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userOneID = new mongoose.Types.ObjectId();
const secret = process.env.TOKEN_SECRET;
const userOne = {
  _id: userOneID,
  username: "Jamesson",
  email: "JAmesson@gmail.com",
  password: "Ezzy@19952",
  tokens: [{ token: jwt.sign({ userOneID }, secret) }],
};
beforeEach(async () => {
  await User.deleteMany();
  await request(app).post("/api/v1/users/register").send({
    username: userOne.username,
    email: userOne.email,
    password: userOne.password,
  });
});
test("should register a new user", async () => {
  await request(app)
    .post("/api/v1/users/register")
    .send({
      username: "Jamesson24",
      email: "James12@gmail.com",
      password: "Ezzy@19952",
    })
    .expect(201);
});

test("Should login existing user", async () => {
  await request(app)
    .post("/api/v1/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("Should not login non-existing user", async () => {
  await request(app)
    .post("/api/v1/users/login")
    .send({
      email: userOne.email,
      password: "Ezzy9952",
    })
    .expect(400);
});
test("should fetch user profile", async () => {
  console.log(userOne.tokens[0].token);
});
