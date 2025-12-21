const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("api", {
  note: (data) => {
    return ipcRenderer.invoke("note", data);
  },
  getNote: (callback)=> ipcRenderer.on("notes", callback)
})