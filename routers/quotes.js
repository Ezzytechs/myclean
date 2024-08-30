const express = require("express");
const router = express.Router();
const { Quotes } = require("../models/quotes");

const adminOnly = require("../utils/auth/admin");
const auth = require("../utils/auth/auth");

// GET all quotes
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const filter = req.query || {};

    const quotesList = await Quotes.find(filter);
    if (!quotesList) {
      return res.status(400).json({ message: "No Quotes Unit Found" });
    }
    res.json(quotesList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Single quotes
router.get("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Invalid Or No ID Provided" });
    }
    const quotes = await Quotes.findOne({ _id: req.params.id });

    if (quotes.length < 1) {
      return res.status(400).json({ message: "quotes Not Found!" });
    }
    res.status(200).send(quotes);
  } catch (error) {
    res.status(400).json({ message: "Something Went Wrong" });
  }
});

// Create new quote
router.post("/", async (req, res) => {
  try {
    const quotes = new Quotes({ ...req.body });
    const newquotes = await quotes.save();
    res.status(201).json(newquotes);
    if (!newquotes) {
      res.status(400).json({ message: "Fail to create" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

//Update Quote
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const quotes = await Quotes.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!quotes) {
      return res.status(400).json("Cannot Find  Quote");
    }
    res.status(200).json(quotes);
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

//Delete Quote
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const quotes = await Quotes.findByIdAndDelete(req.params.id);
    if (quotes) {
      return res.status(200).json({ success: true, message: "quotes Deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "quotes not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Unable to delete" });
  }
});
router.get("/get/statistics", auth, adminOnly, async (req, res) => {
  try {
    const all = await Quotes.countDocuments();

    const newQuotes = await Quotes.countDocuments({ status: "new" });

    const fulfilledQuotes = await Quotes.countDocuments({ status: !"new" });

    // if (!all || !newQuotes || !fulfilledQuotes) {
    //   return res.status(400).json("Unable to count users");
    // }
    return res.json({
      allQuotes: all,
      newQuotes: newQuotes,
      fulfilledQuotes: fulfilledQuotes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong");
  }
});

module.exports = router;
