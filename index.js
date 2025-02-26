const express = require("express");
const cors = require("cors");
const app = express();
const {connection} = require("./database/connection")
const { port } = require("./config");

// database connection

connection()

// cors 

const corsOptioins = {
  origin: "*",
  method: "GET,PUT,PATCH,DELETE,POST,HEAD",
  credentials: true,
};

app.use(cors(corsOptioins));

// server connection

app.listen(port, () => {
  console.log(`Server is running on port ${port} 🔥`);
});
