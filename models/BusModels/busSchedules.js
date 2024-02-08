const mongoose = require("mongoose");
const BusLocations = require("../LocationModels/busLocation");

const busDetailsSchema = new mongoose.Schema({
  busCode: {
    type: String,
    required: true,
    unique: true,
  },
  endingPoint: {
    type: Number,
    required: false,
  },
  startingPoint: {
    type: Number,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
});

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  shortForm: {
    type: String,
    required: true,
    unique: true,
  },
  upTripBuses: {
    type: [busDetailsSchema],
    required: false,
  },
  downTripBuses: {
    type: [busDetailsSchema],
    required: false,
  },
  route: {
    type: [String],
    required: false,
  },
});

busSchema.pre("save", async function (next) {
  try {

    // console.log(this.name, this.upTripBuses.length, this.downTripBuses.length, this.upTripBuses.length + this.downTripBuses.length);
    const existingUpTripBusLocations = await Promise.all(
      this.upTripBuses.map(async (busDetails) => {
        return BusLocations.findOne({
          name: this.name,
          code: busDetails.busCode,
          time: busDetails.time,
          busType: "up-trip",
        });
      })
    );

    const newUpTripBusLocations = this.upTripBuses.filter(
      (busDetails, index) => !existingUpTripBusLocations[index]
    );

    if (newUpTripBusLocations.length > 0) {
      await Promise.all(
        newUpTripBusLocations.map(async (busDetails) => {
          await BusLocations.create({
            name: this.name,
            code: busDetails.busCode,
            busType: "up-trip",
            time: busDetails.time,
            dateWiseLocationData: [],
          });
        })
      );
    }


    const existingDownTripBusLocations = await Promise.all(
        this.downTripBuses.map(async (busDetails) => {
          return BusLocations.findOne({
            name: this.name,
            code: busDetails.busCode,
            busType: "down-trip",
            time: busDetails.time,
          });
        })
      );
  
      const newDownTripBusLocations = this.downTripBuses.filter(
        (busDetails, index) => !existingDownTripBusLocations[index]
      );
  
      if (newDownTripBusLocations.length > 0) {
        await Promise.all(
          newDownTripBusLocations.map(async (busDetails) => {
            await BusLocations.create({
              name: this.name,
              code: busDetails.busCode,
              busType: "down-trip",
              time: busDetails.time,
              dateWiseLocationData: [],
            });
          })
        );
      }

    //   console.log(newUpTripBusLocations.length, newDownTripBusLocations.length);

    next();
  } catch (error) {
    next(error);
  }
});

const BusSchedules = mongoose.model("Bus-Schedules", busSchema);

module.exports = BusSchedules;
