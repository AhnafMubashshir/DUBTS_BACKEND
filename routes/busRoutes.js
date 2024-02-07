const express = require("express");

const router = express.Router();

router.post("/create-new-bus", async (req, res) => {
  console.log(req.body);
  res.json({ message: "Hello World" });
});

router.delete(`/delete-data/:busID`, async (req, res) => {
  console.log(req.body);
  res.json({ message: "Hello World" });
});

module.exports = router;
