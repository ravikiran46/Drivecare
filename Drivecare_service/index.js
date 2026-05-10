const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbconnection = require("./connection");

// Routers
const userRouter = require("./Routes/user");
const ServiceRouter = require("./Routes/Services");
const vehicleRouter = require("./Routes/vehicles");
const addressRouter = require("./Routes/Address");

// middlewares
const { verify } = require("./middlewares/authentication");

const app = express();
const PORT = 3000;

dotenv.config();

// middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// db connection
const dburl = process.env.DB_URI;
dbconnection(dburl).then(() => console.log("Mongodb connected"));

// Routes
app.use("/", userRouter);

app.use("/service", verify, ServiceRouter);

app.use("/vehicle", verify, vehicleRouter);

app.use("/address", verify, addressRouter);

// local run  setup
app.listen(PORT, () => console.log(`server started  at ${PORT}`));
