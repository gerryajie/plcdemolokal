const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getBackendUrl: () => ipcRenderer.invoke("get-backend-url"),
  getBackendStatus: () => ipcRenderer.invoke("get-backend-status"),
  onBackendStatus: (callback) => {
    const listener = (_event, status) => callback(status);

    ipcRenderer.on("backend-status", listener);

    return () => {
      ipcRenderer.removeListener("backend-status", listener);
    };
  },
});
