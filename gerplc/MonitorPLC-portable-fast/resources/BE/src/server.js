const dotenv = require("dotenv");

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env",
});

const express =
  require("express");

const http =
  require("http");

const cors =
  require("cors");


const {
  Server,
} = require("socket.io");


const app = express();

const port =
  process.env.PORT || 5000;

const allowedOrigins =
  (process.env.CORS_ORIGIN || "http://localhost:5173,http://192.168.1.23:3000/")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    console.log("REQUEST ORIGIN:", origin);

    const normalizedOrigin =
      origin?.replace(/\/$/, "");

    if (
      !origin ||
      allowedOrigins.includes(normalizedOrigin) ||
      origin?.startsWith("file://")
    ) {
      return callback(null, true);
    }

    console.log(
      "BLOCKED ORIGIN:",
      normalizedOrigin
    );

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};


const server =
  http.createServer(app);


const io =
  new Server(server, {

    cors: corsOptions,

  });


const sequelize =
  require("./config/database");


const authRoutes =
  require("./routes/authRoutes");

const reportRoutes =
  require("./routes/reportRoutes");

const plcLogRoutes =
  require("./routes/plcLogRoutes");


const {
  connectPLC,
} = require("./services/s7Service");


const {
  initSocket,
} = require("./sockets/socket");


initSocket(io);


app.use(cors(corsOptions));

app.use(express.json());


app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/plc-logs",
  plcLogRoutes
);


const syncOptions =
  process.env.DB_SYNC_ALTER === "true"
    ? { alter: true }
    : {};

sequelize

  .sync(syncOptions)

  .then(() => {

    console.log(
      "DATABASE CONNECTED"
    );


    connectPLC();


    server.listen(
      port,
      () => {

        console.log(

          `SERVER RUNNING ON ${port}`

        );

      }
    );

  })

  .catch((err) => {

    console.log(
      "DATABASE ERROR:",
      err
    );

  });

// Serve frontend static files when in production and the build is placed in ../public
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  const publicPath = path.join(__dirname, "..", "public");

  // Serve static assets
  app.use(express.static(publicPath));

  // Fallback to index.html for SPA routes (except API routes)
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(publicPath, "index.html"));
  });
}
