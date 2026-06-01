const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getBackendUrl: () =>
    new Promise((resolve) => {
      ipcRenderer.once("backend-url", (event, url) => {
        resolve(url);
      });
      ipcRenderer.send("get-backend-url");
    }),
});
