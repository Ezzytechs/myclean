const express = require("express");
const router = express.Router();
const { Book } = require("../models/book");
const auth = require("../utils/auth/auth");
const adminOnly = require("../utils/auth/admin");

router.get(`/`, async (req, res) => {
  try {
    let filter = {};
    if (req.query) {
      filter = { ...req.query };
    }
    const books = await Book.find(filter);
    if (books.length < 1 || !books) {
      return res.status(400).json({ Message: "No booked Clean found" });
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ Message: "Something Went Wrong" });
  }
});

router.get("/:id", auth, adminOnly, async (req, res) => {
  try {
    const house = await Book.findById(req.params.id);

    if (!house) {
      return res.status(400).json({ message: "House Not Found!" });
    }
    res.status(200).send(house);
  } catch (error) {
    res.status(400).json({ message: "Something Went Wrong" });
  }
});

router.post("/", async (req, res) => {
  const book = new Book({
    ...req.body,
  });
  const newBook = await book.save();
  if (!newBook) {
    return res.status(400).send("Failed to book");
  }
  res.status(201).json(newBook);
});

router.put("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!book) {
      return res.status(400).json({ message: "Book Not Found!" });
    }
    res.status(200).send(book);
  } catch (error) {
    res.status(400).json({ message: "Something Went Wrong" });
  }
});

router.get("/get/statistics", auth, adminOnly, async (req, res) => {
  try {
    const bookCount = await Book.countDocuments();
    const UnfulfiledBooks = await Book.countDocuments({ status: "Pending" });
    const fulfiledBooks = await Book.countDocuments({ status: "Fulfiled" });
    // if (!bookCount) {
    //   res.status(400).json({ Message: "No Books found" });
    // }
    res.status(200).json({
      total: bookCount,
      pendingBooks: UnfulfiledBooks,
      fulfiledBooks: fulfiledBooks,
    });
  } catch (error) {
    res.status(500).json({ Message: "Something Went Wrong" });
  }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "Book with provided id does not exist!" });
    }

    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(400).json({ message: "Not found" });
    }
  } catch (err) {
    res.status(400).json({ Message: "Something Went Wrong" });
  }
});

module.exports = router;
