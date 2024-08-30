const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema({
  kitcheen: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  House: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  bathroom: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  cleanType: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
});

exports.Services = mongoose.model("Service", servicesSchema);

//  "kitcheen": [
//     {
//       "name": ,
//       "price": ,
//     },
//   ],

//   "House": [
//     {
//       "name": ,
//       "price":,
//     },
//   ],
//   "bathroom": [
//     {
//       "name": ,
//       "price": ,
//     },
//   ],
//   "cleanType": [
//     {
//       "name": ,
//       "price":,
//     },
//   ]
