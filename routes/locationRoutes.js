const express = require("express");
const BusLocations = require("../models/LocationModels/busLocation");
const cron = require('node-cron');

const router = express.Router();

let locationData = {};

const fetchAndProcessData = async () => {
  try {
    locationData = {};
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const currentDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDayOfWeek];
    const currentTime = currentDate.toLocaleTimeString('en-US', { hour12: false });

    // console.log("Current Time: ", currentTime);

    const allBuses = await BusLocations.find();

    allBuses.forEach(async (busLocation) => {
      const dateWiseLocationData = busLocation.dateWiseLocationData[0];

      if (dateWiseLocationData) {
        const timeWiseLocationData = dateWiseLocationData.timeWiseLocationData.filter(
          (timeData) => timeData.time === currentTime
        );

        if (timeWiseLocationData.length > 0) {
          console.log(`Bus: ${busLocation.name}\nBusCode: ${busLocation.code}\nCurrent Time Data: `, timeWiseLocationData);
          locationData[busLocation.code] = { name: busLocation.name, code: busLocation.code, data: timeWiseLocationData }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching and processing data:", error);
  }
};

cron.schedule("* * * * * *", fetchAndProcessData);

router.get("/get-real-time-data", async (req, res) => {
  // console.log("request for time wise location data");
  // console.log({locationData});
  res.json(locationData);
});

router.put("/store-location/:busCode", async (req, res) => {
  const { busCode } = req.params;

  try {
    const busLocation = await BusLocations.findOne({ code: busCode });

    if (!busLocation) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const { date, latitude, longitude, time } = req.body;
    const parsedDate = new Date(date);
    const dayOfWeek = parsedDate.getDay();
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];

    console.log(dayName);

    const createNewDateWiseLocation = () => {
      busLocation.dateWiseLocationData.push({
        date: date,
        dayName: dayName,
        timeWiseLocationData: [
          {
            time: time,
            latitude: latitude,
            longitude: longitude,
          },
        ],
      });
    };

    if (busLocation.dateWiseLocationData.length > 0) {
      const dateIndex = busLocation.dateWiseLocationData.findIndex(
        (locationData) => locationData.date.toString() === date.toString()
      );

      if (dateIndex >= 0) {
        busLocation.dateWiseLocationData[dateIndex].timeWiseLocationData.push({
          time: time,
          latitude: latitude,
          longitude: longitude,
        });
      } else {
        createNewDateWiseLocation();
      }
    } else {
      createNewDateWiseLocation();
    }

    await busLocation.save();

    console.log(`Location is saved successfully. for ${dayName} ${date}`);

    res.json({ message: "Bus location updated successfully" });
  } catch (error) {
    console.error("Error updating bus location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-all-locations", async (req, res) => {
  try {
    const allLocations = await BusLocations.find();
    res.json(allLocations);
  } catch (error) {
    console.error("Error fetching all locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-all-bus-location", async (req, res) => {
  try {
    // Delete all bus schedules
    await BusLocations.deleteMany({});
    res.json({ message: "All bus location data deleted successfully" });
  } catch (error) {
    console.error("Error deleting all bus location data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-bus-location-by-bus-name/:busName", async (req, res) => {
  const { busName } = req.params;
  try {
    // Delete all bus locations with the name "basanta"
    await BusLocations.deleteMany({ name: busName });
    res.json({ message: `All bus location data with name ${busName} deleted successfully` });
  } catch (error) {
    console.error("Error deleting location data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-bus-location-by-bus-code/:busCode", async (req, res) => {
  const { busCode } = req.params;
  try {
    // Delete all bus locations with the name "basanta"
    await BusLocations.deleteMany({ code: busCode });
    res.json({ message: `All bus location data with code ${busCode} deleted successfully` });
  } catch (error) {
    console.error("Error deleting location data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-bus-location-by-bus-name/:busName", async (req, res) => {
  const { busName } = req.params;
  try {
    // Delete all bus locations with the name "basanta"
    const locations = await BusLocations.find({ name: busName });
    res.json(locations);
  } catch (error) {
    console.error("Error fetching bus location data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-bus-location-by-bus-code/:busCode", async (req, res) => {
  const { busCode } = req.params;
  try {
    // Delete all bus locations with the name "basanta"
    const locations = await BusLocations.find({ code: busCode });
    res.json(locations);
  } catch (error) {
    console.error("Error fetching bus location data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-bus-location-by-bus-time/:busTime", async (req, res) => {
  const { busTime } = req.params;
  try {
    // Delete all bus locations with the name "basanta"
    const locations = await BusLocations.find({ time: busTime });
    res.json(locations);
  } catch (error) {
    console.error("Error fetching bus location data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;