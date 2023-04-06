const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();

//routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//middleware
app.use(cors());
app.use(express.json());

//route middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

//connect to db
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Database connected!"))
  .catch(() => console.log("Error to connecting database!"));

//listening server
app.listen(3000, () => console.log("server is running up!"));
