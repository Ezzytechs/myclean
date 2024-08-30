const express = require("express");
const router = express.Router();
const { Services } = require("../models/services");

const adminOnly = require("../utils/auth/admin");
const auth = require("../utils/auth/auth");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const servicesList = await Services.find();
    if (!servicesList) {
      return res.status(400).json({ message: "No Service Unit Found" });
    }
    res.json(servicesList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Single category
router.get("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Invalid Or No ID Provided" });
    }
    const service = await Services.findOne({ _id: req.params.id });

    if (service.length < 1) {
      return res.status(400).json({ message: "service Unit Not Found!" });
    }
    res.status(200).send(service);
  } catch (error) {
    res.status(400).json({ message: "Something Went Wrong" });
  }
});

// Create a new category
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const service = new Services({ ...req.body });
    const newService = await service.save();
    res.status(201).json(newService);
    if (!newService) {
      res.status(400).json({ message: "Fail to create" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

// Create a new category
router.post("/add/new/:id", async (req, res) => {
  const fieldName = Object.keys(req.body)[0];
  try {
    let service = await Services.findById(req.params.id);
    const fieldData = service[fieldName];
    console.log(fieldData);
    // const newService = new Services({ serviceAll });
    // await newService.save();
    //  const services=await
    // const service = new Services({ ...req.body });
    // const newService = await service.save();
    // res.status(201).json(newService);
    // if (!serviceAll) {
    //   res.status(400).json({ message: "Fail to create" });
    // }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

//Update Housing Unit
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const service = await Services.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!service) {
      return res.status(400).json("Cannot Find The Housing Unit");
    }
    res.status(200).json(service);
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

//Delete Category
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const service = await Services.findByIdAndDelete(req.params.id);
    if (service) {
      return res
        .status(200)
        .json({ success: true, message: "Service Deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Unable to delete" });
  }
});

module.exports = router;
