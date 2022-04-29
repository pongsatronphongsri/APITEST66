const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nameProduct: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  
});

const User = mongoose.model("addcart", userSchema);
module.exports = addcart;