const { app, BrowserWindow, ipcMain } = require("electron");
const loki = require("lokijs");
const path = require("path");

const adapter = new loki.LokiFsAdapter();
const dbPath = path.join(app.getPath("userData"), "notes.json");

let db;
let notes;
let win;

app.whenReady().then(() => {
  db = new loki(dbPath, {
    adapter,
    autoload: true,
    autosave: true,
    autosaveInterval: 1000,
    autoloadCallback: () => {
      notes = db.getCollection("notes") || db.addCollection("notes");
      createWindow();
    },
  });
});

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  win.webContents.openDevTools();

  win.webContents.on("did-finish-load", () => {
    win.webContents.send("notes", notes.find());
  });
}

ipcMain.handle("note", (_, data) => {
  notes.insert(data);
  db.saveDatabase();
  win.webContents.send("notes", notes.find());
});

ipcMain.handle("spacific-data", (_, data) => {
  const res = notes.get(data?.id);

  return res;
});

ipcMain.handle("update-data", (_, data) => {
  const res = notes.get(data?.noteId);
  res.title = data?.title;
  res.details = data?.details;

  notes.update(res);
  win.webContents.send("notes", notes.find());
});

ipcMain.handle("delete-data", (_, data) => {
  const note = notes.get(data?.noteId);
  notes.remove(note);
  win.webContents.send("notes", notes.find());
});
