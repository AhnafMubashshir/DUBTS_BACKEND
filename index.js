var express = require("express");
var cors = require("cors");
const connectDB = require("./database/database");

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const locationRoutes = require("./routes/locationRoutes");
app.use("/dubts/bus-location", locationRoutes);

const busRoutes = require("./routes/busRoutes");
app.use("/dubts/bus-details", busRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
