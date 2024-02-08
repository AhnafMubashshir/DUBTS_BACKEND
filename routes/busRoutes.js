const express = require("express");
const BusSchedules = require("../models/BusModels/busSchedules");

const router = express.Router();

router.post("/create-new-bus-schedule", async (req, res) => {
  try {
    const busesToCreate = req.body;
    let createdBuses = [];

    for (const busToCreate of busesToCreate) {
      const bus = new BusSchedules({
        name: busToCreate.name,
        shortForm: busToCreate.shortForm,
        upTripBuses: busToCreate.upTripBuses,
        downTripBuses: busToCreate.downTripBuses,
        route: busToCreate.route,
      });

      try {
        const createdBus = await bus.save();
        createdBuses.push(createdBus);
      } catch (error) {
        console.error("Error creating bus: ", error);
      }
    }

    res.json({ createdBuses: createdBuses });
  } catch (error) {
    console.error("Error creating bus schedule:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(`/delete-data/:busID`, async (req, res) => {
  res.json({ message: "Tis route is under construction" });
});

module.exports = router;
