const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const net = require("net");

let mainWindow;
let backendProcess;

const BACKEND_PORT =
  Number(process.env.BACKEND_PORT || 5000);
const BACKEND_HOST = "http://127.0.0.1";
const BACKEND_URL = `${BACKEND_HOST}:${BACKEND_PORT}`;
const isDev = !app.isPackaged;
let logFile;

function getLogFile() {
  if (!logFile) {
    const logDir = path.join(
      app.getPath("userData"),
      "logs"
    );

    fs.mkdirSync(logDir, {
      recursive: true,
    });

    logFile = path.join(logDir, "main.log");
  }

  return logFile;
}

function writeLog(...args) {
  const line = args
    .map((arg) => {
      if (arg instanceof Error) {
        return `${arg.message}\n${arg.stack || ""}`;
      }

      if (typeof arg === "string") {
        return arg;
      }

      return JSON.stringify(arg);
    })
    .join(" ");

  fs.appendFileSync(
    getLogFile(),
    `${new Date().toISOString()} ${line}\n`
  );

  console.log(...args);
}

function waitForPort(port, host = "127.0.0.1") {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 45;

    const timer = setInterval(() => {
      const socket = new net.Socket();

      socket.setTimeout(1000);

      socket.once("connect", () => {
        socket.destroy();
        clearInterval(timer);
        resolve();
      });

      socket.once("timeout", () => {
        socket.destroy();
      });

      socket.once("error", () => {
        socket.destroy();
      });

      socket.once("close", () => {
        attempts += 1;

        if (attempts >= maxAttempts) {
          clearInterval(timer);
          reject(
            new Error(
              `Backend server did not start on port ${port}`
            )
          );
        }
      });

      socket.connect(port, host);
    }, 1000);
  });
}

function getBackendPath() {
  if (isDev) {
    return path.join(
      __dirname,
      "../../BE/src/server.js"
    );
  }

  return path.join(
    process.resourcesPath,
    "BE/src/server.js"
  );
}

function getBackendRunner() {
  if (isDev) {

    return {
      command: "node",
      env: {},
    };

  }

  const runtimeName =
    process.platform === "win32"
      ? "node.exe"
      : "node";

  const runtimePath =
    path.join(
      process.resourcesPath,
      "runtime",
      runtimeName
    );

  if (fs.existsSync(runtimePath)) {

    return {
      command: runtimePath,
      env: {},
    };

  }

  return {
    command: process.execPath,
    env: {
      ELECTRON_RUN_AS_NODE: "1",
    },
  };
}

async function startBackendServer() {
  const backendPath = getBackendPath();
  const backendRunner =
    getBackendRunner();

  writeLog("Starting backend from:", backendPath);
  writeLog("Starting backend with:", backendRunner.command);

  const backendEnv = {
    ...process.env,
    ...backendRunner.env,
    PORT: String(BACKEND_PORT),
    NODE_ENV: isDev ? "development" : "production",
  };

  if (!backendRunner.env.ELECTRON_RUN_AS_NODE) {

    delete backendEnv.ELECTRON_RUN_AS_NODE;

  }

  backendProcess = spawn(
    backendRunner.command,
    [backendPath],
    {
      cwd: path.dirname(path.dirname(backendPath)),
      stdio: ["ignore", "pipe", "pipe"],
      env: backendEnv,
    }
  );

  backendProcess.stdout.on("data", (data) => {
    writeLog("[backend]", data.toString().trim());
  });

  backendProcess.stderr.on("data", (data) => {
    writeLog("[backend:error]", data.toString().trim());
  });

  backendProcess.once("error", (err) => {
    writeLog("Backend process error:", err);
  });

  backendProcess.once("exit", (code) => {
    if (code !== 0) {
      writeLog("Backend exited with code:", code);
    }
  });

  await waitForPort(BACKEND_PORT);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 640,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
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

function stopBackendServer() {
  if (!backendProcess) {
    return;
  }

  backendProcess.kill();
  backendProcess = null;
}

ipcMain.handle("get-backend-url", () => BACKEND_URL);

app.whenReady().then(async () => {
  try {
    await startBackendServer();
    createWindow();
  } catch (error) {
    writeLog("Failed to start app:", error);

    dialog.showErrorBox(
      "MonitorPLC gagal dibuka",
      [
        error.message,
        "",
        "Cek log:",
        getLogFile(),
      ].join("\n")
    );

    app.quit();
  }
});

app.on("window-all-closed", () => {
  stopBackendServer();
  app.quit();
});

app.on("before-quit", () => {
  stopBackendServer();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
