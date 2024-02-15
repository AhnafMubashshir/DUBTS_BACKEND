const express = require("express");
const BusLocations = require("../models/LocationModels/busLocation");

const router = express.Router();

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

module.exports = router;
