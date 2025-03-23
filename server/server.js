const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));
app.use(express.json());

// Import Routes

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/campaigns", require("./routes/campaignRoutes"));

app.use("/api/donations", require("./routes/donationRoutes"));

app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));


const PORT = process.env.PORT || 7000;
app.listen(PORT,  () => {
    try {
        console.log(`Server running at http://localhost:${PORT}`);
    } catch (error) {
        console.log("Error in Staring Server");
    }
});
