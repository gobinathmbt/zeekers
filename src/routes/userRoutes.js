const express = require("express");
const app = express.Router();
const user = require("../controllers/userController");
 
app.post("/reg_user", user.register_user);
app.post("/login_user", user.login_user);
 
 
module.exports = app;