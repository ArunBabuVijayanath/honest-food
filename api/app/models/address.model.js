const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressModelScheme = mongoose.Schema(
  {
    houseName: {
      type: String,
      required: true,
      default: ""
    },
    city: {
      type: String,
      required: true,
      default: ""
    },
    state: {
      type: String,
      required: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("AddressModel", AddressModelScheme);
