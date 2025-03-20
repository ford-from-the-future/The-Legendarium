require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const worldAnvilRoutes = require("./routes/worldAnvilRoutes");
app.use("/api", worldAnvilRoutes);

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
