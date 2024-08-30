const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const quotesSchema = new mongoose.Schema({
  name: {
    fName: String,
    lName: String,
  },
  email: { type: String },
  phone: { type: String },
  notes: { type: String },
  address: { type: String },
  status: { type: String, default: "new" },
  suit: { name: { type: String }, price: { type: Number } },
  footEstimation: { type: String },
  cleanType: { suitName: { type: String }, price: { type: Number } },
  date: { type: Date, required: true },
  employerNumber: { type: String },
});

// productSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// productSchema.set("toJSON", {
//   virtuals: true,
// });

exports.Quotes = mongoose.model("Quote", quotesSchema);

// {
// "fName":"EzekieEzekiel",
// "lName":"James",
// "email":"jameze49@gmail.com",
// "phone":"0904564635",

// "address":{
// "street":"Ogorode",
// "city":"Sapele",
// "state":"Delta",
// "postalCode":"267487",
// "country":"Nigeria"
// },

// }
