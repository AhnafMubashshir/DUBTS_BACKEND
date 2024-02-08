const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    time: {
        type: String,
        required: true,
    }
  });

const allLocationSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  timeWiseLocationData: {
    type: [locationSchema],
    required: true,
  },
});

const busLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  busType: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    require: true,
  },
  dateWiseLocationData: {
    type: [allLocationSchema],
    required: false,
  },
});

const BusLocations = mongoose.model("Bus-Locations", busLocationSchema);

module.exports = BusLocations;
