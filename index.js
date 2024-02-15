//ExpressJS Requirments
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();


app.use(cors());

// need info 
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// 



const port = 9000;


const user = require("./src/routes/userRoutes");
const canditate = require("./src/routes/canditateRoutes");



mongoose
.connect("mongodb+srv://gobinath:gobinath3@gobinath.xibawsy.mongodb.net/")
.then(() => {console.log("Connected to MongoDB");})
.catch((err) => {console.error("MongoDB connection error:", err);});



//MiddleWares
app.use(user);
app.use(canditate);

//Middleware for health check
app.use("/api/v1/health", async (req, res) => {
  try {await mongoose.connection.db.command({ ping: 1 });res.json({status: "Database is healthy",health: "API Server is up & running",});
  } catch (error) {console.error("Database is not healthy:", error);res.status(500).json({ status: "Database is not healthy", error: error.message });}
});



app.listen(port, () => {
  console.log("CONNECT Server is running on http://localhost: " + port);
});


