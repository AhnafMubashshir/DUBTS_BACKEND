const express = require("express");

const router = express.Router();

router.post("/store-data", async (req, res) => {
  console.log(req.body);
  res.json({ message: "Hello World" });
});

module.exports = router;