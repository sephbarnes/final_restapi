require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
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
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));
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
console.log("here I am");
//OLD   SERVER ADDITION
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");
  
    const extension = path.extname(req.url);
  
    let contentType;
  
    switch (extension) {
      case ".css":
        contentType = "text/css";
        break;
      case ".js":
        contentType = "text/javascript";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".jpg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".txt":
        contentType = "text/plain";
        break;
      default:
        contentType = "text/html";
    }
  
    let filePath =
      contentType === "text/html" && req.url === "/"
        ? path.join(__dirname, "views", "index.html")
        : contentType === "text/html" && req.url.slice(-1) === "/"
        ? path.join(__dirname, "views", req.url, "index.html")
        : contentType === "text/html"
        ? path.join(__dirname, "views", req.url)
        : path.join(__dirname, req.url);
  
    // makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== "/") filePath += ".html";
  
    const fileExists = fs.existsSync(filePath);
  
    if (fileExists) {
      serveFile(filePath, contentType, res);
    } else {
      switch (path.parse(filePath).base) {
        case "old-page.html":
          res.writeHead(301, { Location: "/new-page.html" });
          res.end();
          break;
        case "www-page.html":
          res.writeHead(301, { Location: "/" });
          res.end();
          break;
        case "statesData.json":
            res.writeHead(301, { Location: "/" });
            res.end();
            break;
        default:
          serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
      }
    }
  });
//END OLDSERVER ADDITION
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});