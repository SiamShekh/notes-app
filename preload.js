const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("api", {
  note: (data) => {
    return ipcRenderer.invoke("note", data);
  },
  getNote: (callback) => ipcRenderer.on("notes", callback),
  getSpacificNote: (data) => ipcRenderer.invoke("spacific-data", data),
  updateSpacificNote: (data) => ipcRenderer.invoke("update-data", data),
  deleteNote: (data)=> ipcRenderer.invoke("delete-data", data)
})