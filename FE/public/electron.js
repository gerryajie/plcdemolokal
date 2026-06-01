const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const { spawn } = require("child_process");
const net = require("net");

let mainWindow;
let backendProcess;
const BACKEND_PORT = process.env.BACKEND_PORT || 5000;
const BACKEND_HOST = "http://localhost";

// Check if port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      } else {
        resolve(true);
      }
    });
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

// Start backend server
function startBackendServer() {
  return new Promise((resolve, reject) => {
    try {
      const backendPath = isDev
        ? path.join(__dirname, "../../../BE/src/server.js")
        : path.join(
            process.resourcesPath,
            "app/BE/src/server.js"
          );

      console.log("Starting backend from:", backendPath);

      backendProcess = spawn("node", [backendPath], {
        stdio: "inherit",
        env: {
          ...process.env,
          PORT: BACKEND_PORT,
          NODE_ENV: isDev ? "development" : "production",
        },
      });

      backendProcess.on("error", (err) => {
        console.error("Backend process error:", err);
        reject(err);
      });

      // Wait for backend to start
      let attempts = 0;
      const checkBackend = setInterval(() => {
        const socket = new net.Socket();
        socket.setTimeout(1000);

        socket.on("connect", () => {
          socket.destroy();
          clearInterval(checkBackend);
          console.log("Backend server is ready");
          resolve();
        });

        socket.on("timeout", () => {
          socket.destroy();
          attempts++;
          if (attempts > 30) {
            // 30 seconds timeout
            clearInterval(checkBackend);
            reject(new Error("Backend server failed to start"));
          }
        });

        socket.on("error", () => {
          if (attempts > 30) {
            clearInterval(checkBackend);
            reject(new Error("Backend server failed to start"));
          }
        });

        socket.connect(BACKEND_PORT, "localhost");
      }, 1000);
    } catch (error) {
      reject(error);
    }
  });
}

// Create browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, "icon.png"),
  });

  const startUrl = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "../dist/index.html")}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Handle IPC events
ipcMain.on("get-backend-url", (event) => {
  event.reply("backend-url", `${BACKEND_HOST}:${BACKEND_PORT}`);
});

// App event handlers
app.on("ready", async () => {
  try {
    // Check if port is available, if not try next port
    let portAvailable = await isPortAvailable(BACKEND_PORT);
    if (!portAvailable) {
      console.log(`Port ${BACKEND_PORT} is in use`);
    }

    await startBackendServer();
    createWindow();
  } catch (error) {
    console.error("Failed to start app:", error);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Cleanup on exit
process.on("exit", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
