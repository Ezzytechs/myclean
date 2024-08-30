const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    fName: String,
    lName: String,
  },
  email: { type: String },
  phone: { type: String },
  notes: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  status: { type: String, default: "pending" },
  kitcheen: { name: { type: String }, price: { type: Number } },
  house: { name: { type: String }, price: { type: Number } },
  bathroom: { name: { type: String }, price: { type: Number } },
  cleanType: { name: { type: String }, price: { type: Number } },
  city: { name: String, price: Number },
  date: { type: Date, required: true },
  occurence: { type: String },
  totalPrice: { type: Number },
});

// productSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// productSchema.set("toJSON", {
//   virtuals: true,
// });

exports.Book = mongoose.model("Book", bookSchema);

// {
// "fName":"EzekieEzekiel",
// "lName":"James",
// "email":"jameze49@gmail.com",
// "phone":"0904564635",
// "notes":"I want this event always",

// "address":{
// "street":"Ogorode",
// "city":"Sapele",
// "state":"Delta",
// "postalCode":"267487",
// "country":"Nigeria"
// },
// "status":"" ,
// "kitcheen":{"name":"1 kitcheen", "price":10},
// "House": {"name":"1 Bedroom", "price":30},
// "bathroom": {"name":"1 bathroom", "price":10},
// "cleanType": {"name":"Standard", "price":10},
// "date": "20 July 2024",
// "occurence": "Daily"
// totalPrice:500
// }
