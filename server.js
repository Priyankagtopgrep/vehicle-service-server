
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/services", serviceRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Vehicle Service Management API is running successfully"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
