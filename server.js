require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
//const verifyStates = require('./middleware/verifyStates');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;
const http = require("http");
const fs = require("fs");
const fsPromises = require("fs").promises;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

//middleware for verify states
//app.use(verifyStates);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

const EventEmitter = require("events");
class Emitter extends EventEmitter {}
// initialize object
const myEmitter = new Emitter();

const serveFile = async (filePath, contentType, response) => {
    try {
      const rawData = await fsPromises.readFile(
        filePath,
        !contentType.includes("image") ? "utf8" : ""
      );
      const data =
        contentType === "application/json" ? JSON.parse(rawData) : rawData;
      response.writeHead(filePath.includes("404.html") ? 404 : 200, {
        "Content-Type": contentType,
      });
      response.end(
        contentType === "application/json" ? JSON.stringify(data) : data
      );
    } catch (err) {
      console.log(err);
      myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");
      response.statusCode = 500;
      response.end();
    }
  };

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));

app.use('/employees', require('./routes/api/employees'));
app.use('/states', require('./routes/api/states'));

app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) { 
        res.json({ "error": "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});