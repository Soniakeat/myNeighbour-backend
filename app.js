require("dotenv").config();

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");

// MONGOOSE CONNECTIONl
mongoose
    .connect(process.env.MONGODB_URI, {
        keepAlive: true,
        useNewUrlParser: true,
        reconnectTries: Number.MAX_VALUE,
        useUnifiedTopology: true
    })
    .then(() => console.log(`Connected to database`))
    .catch(err => console.error(err));

// EXPRESS SERVER INSTANCE
const app = express();

// CORS MIDDLEWARE SETUP
app.use(
    cors({
        credentials: true,
        origin: [process.env.PUBLIC_DOMAIN]
    })
);

// SESSION MIDDLEWARE
app.use(
    session({
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 24 * 60 * 60 // 1 day
        }),
        secret: process.env.SECRET_SESSION,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

// MIDDLEWARE
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ROUTER MIDDLEWARE
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const itemRouter = require("./routes/items");

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/items", itemRouter);

// ERROR HANDLING
app.use((req, res, next) => {
    res.status(404).json({
        code: "not found"
    });
});

app.use((err, req, res, next) => {
    // always log the error
    console.error("ERROR", req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
        const statusError = err.status || "500";
        res.status(statusError).json(err);
    }
});

module.exports = app;